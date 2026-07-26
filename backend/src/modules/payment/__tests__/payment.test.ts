import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPaymentIntent } from "../payment.service";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/util/errors";
import type { AuthUser } from "@/middleware/auth.middleware";

// Mock the Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock the Stripe client
vi.mock("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: {
      retrieve: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const customerUser: AuthUser = {
  id: "user-1",
  email: "customer@test.com",
  role: "CUSTOMER",
};

const adminUser: AuthUser = {
  id: "admin-1",
  email: "admin@test.com",
  role: "ADMIN",
};

const baseOrder = {
  id: "order-1",
  userId: "user-1",
  restaurantId: "restaurant-1",
  status: "PENDING",
  totalPrice: 25.5,
  paymentStatus: "UNPAID",
  stripePaymentIntentId: null,
  createdAt: new Date(),
};

describe("createPaymentIntent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws NotFoundError if the order doesn't exist", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue(null);

    await expect(
      createPaymentIntent("missing-order", customerUser)
    ).rejects.toThrow(NotFoundError);
  });

  it("throws ForbiddenError if a customer tries to pay for someone else's order", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      ...baseOrder,
      userId: "someone-else",
    } as any);

    await expect(
      createPaymentIntent("order-1", customerUser)
    ).rejects.toThrow(ForbiddenError);
  });

  it("allows an ADMIN to create an intent for any user's order", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      ...baseOrder,
      userId: "someone-else",
    } as any);
    vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
      id: "pi_admin",
      client_secret: "secret_admin",
      status: "requires_payment_method",
      amount: 2550,
    } as any);
    vi.mocked(prisma.order.update).mockResolvedValue({} as any);

    const result = await createPaymentIntent("order-1", adminUser);

    expect(result.clientSecret).toBe("secret_admin");
  });

  it("throws BadRequestError if the order is already paid", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      ...baseOrder,
      paymentStatus: "PAID",
    } as any);

    await expect(
      createPaymentIntent("order-1", customerUser)
    ).rejects.toThrow(BadRequestError);
  });

  it("creates a new PaymentIntent and stores it on the order when none exists", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue(baseOrder as any);
    vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
      id: "pi_new123",
      client_secret: "secret_new123",
      status: "requires_payment_method",
      amount: 2550,
    } as any);
    vi.mocked(prisma.order.update).mockResolvedValue({} as any);

    const result = await createPaymentIntent("order-1", customerUser);

    // amount is derived from totalPrice in cents — this guards against
    // a regression that reads the wrong field or forgets *100
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 2550, currency: "usd" })
    );
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-1" },
      data: {
        stripePaymentIntentId: "pi_new123",
        paymentStatus: "PROCESSING",
      },
    });
    expect(result.clientSecret).toBe("secret_new123");
  });

  it("reuses an existing PaymentIntent if it's still valid and the amount matches", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      ...baseOrder,
      stripePaymentIntentId: "pi_existing",
      paymentStatus: "PROCESSING",
    } as any);
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
      id: "pi_existing",
      client_secret: "secret_existing",
      status: "requires_payment_method",
      amount: 2550,
    } as any);

    const result = await createPaymentIntent("order-1", customerUser);

    expect(stripe.paymentIntents.create).not.toHaveBeenCalled();
    expect(result.clientSecret).toBe("secret_existing");
  });

  it("creates a fresh PaymentIntent if the existing one's amount is stale (order total changed)", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      ...baseOrder,
      stripePaymentIntentId: "pi_stale",
      paymentStatus: "PROCESSING",
    } as any);
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
      id: "pi_stale",
      client_secret: "secret_stale",
      status: "requires_payment_method",
      amount: 999, // stale — doesn't match order.totalPrice (2550)
    } as any);
    vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
      id: "pi_fresh",
      client_secret: "secret_fresh",
      status: "requires_payment_method",
      amount: 2550,
    } as any);
    vi.mocked(prisma.order.update).mockResolvedValue({} as any);

    const result = await createPaymentIntent("order-1", customerUser);

    expect(stripe.paymentIntents.create).toHaveBeenCalled();
    expect(result.clientSecret).toBe("secret_fresh");
  });

  it("creates a fresh PaymentIntent if the existing one has already succeeded/canceled", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      ...baseOrder,
      stripePaymentIntentId: "pi_done",
      paymentStatus: "PROCESSING",
    } as any);
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
      id: "pi_done",
      client_secret: "secret_done",
      status: "canceled",
      amount: 2550,
    } as any);
    vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
      id: "pi_fresh2",
      client_secret: "secret_fresh2",
      status: "requires_payment_method",
      amount: 2550,
    } as any);
    vi.mocked(prisma.order.update).mockResolvedValue({} as any);

    const result = await createPaymentIntent("order-1", customerUser);

    expect(stripe.paymentIntents.create).toHaveBeenCalled();
    expect(result.clientSecret).toBe("secret_fresh2");
  });
});
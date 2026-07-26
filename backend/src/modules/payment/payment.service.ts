import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/util/errors";
import type { AuthUser } from "@/middleware/auth.middleware";

export async function createPaymentIntent(orderId: string, user: AuthUser) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new NotFoundError("Order");
  }

  if (order.userId !== user.id && user.role !== "ADMIN") {
    throw new ForbiddenError("You do not have access to this order");
  }

  if (order.paymentStatus === "PAID") {
    throw new BadRequestError("Order is already paid");
  }

  const amountInCents = Math.round(order.totalPrice * 100);

  // Reuse an existing PaymentIntent if one's already attached and still usable,
  // instead of creating a duplicate on every retry/page refresh.
  if (order.stripePaymentIntentId) {
    const existing = await stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );
    if (
      ["requires_payment_method", "requires_confirmation", "requires_action"].includes(
        existing.status
      ) &&
      existing.amount === amountInCents
    ) {
      return { clientSecret: existing.client_secret };
    }
  }

  const intent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id, userId: user.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripePaymentIntentId: intent.id,
      paymentStatus: "PROCESSING",
    },
  });

  return { clientSecret: intent.client_secret };
}
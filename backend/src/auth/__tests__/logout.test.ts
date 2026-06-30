import { vi, describe, it, expect } from "vitest";

vi.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { logout } from "../auth_service";

describe("logout()", () => {
  it("should return message", async () => {
    const result = await logout();

    expect(result.message).toBe(
      "Logged out. Delete your token on the client."
    );
  });
});
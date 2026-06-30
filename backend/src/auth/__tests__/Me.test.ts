import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from "../../lib/prisma"
import { getMe } from "../auth_service"

const prismaMock = prisma as any

describe("getMe()", () => {
  beforeEach(() => vi.clearAllMocks())

  it("should return user", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "1",
      name: "John",
      email: "john@test.com",
      role: "CUSTOMER",
      createdAt: new Date(),
    })

    const result = await getMe("1")

    expect(result.email).toBe("john@test.com")
  })

  it("should throw if user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(getMe("99")).rejects.toThrow("User not found")
  })
})
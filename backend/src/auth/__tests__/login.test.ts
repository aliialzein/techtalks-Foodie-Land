import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}))

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}))

import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { login } from "../auth_service"

const prismaMock = prisma as any
const bcryptMock = bcrypt as any
const jwtMock = jwt as any

describe("login()", () => {
  beforeEach(() => vi.clearAllMocks())

  it("should login successfully", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "1",
      name: "John",
      email: "john@test.com",
      password: "hashed",
      role: "CUSTOMER",
    })

    bcryptMock.compare.mockResolvedValue(true)
    jwtMock.sign.mockReturnValue("token")

    const result = await login({
      email: "john@test.com",
      password: "123",
    })

    expect(result.token).toBe("token")
  })

  it("should fail if user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(
      login({ email: "x@test.com", password: "123" })
    ).rejects.toThrow("Invalid email please try again")
  })

  it("should fail if Wrong password", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "1",
      password: "hashed",
    })

    bcryptMock.compare.mockResolvedValue(false)

    await expect(
      login({ email: "john@test.com", password: "wrong" })
    ).rejects.toThrow("Wrong password")
  })
})
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}))

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}))

import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { register } from "../auth_service"

const prismaMock = prisma as any
const bcryptMock = bcrypt as any
const jwtMock = jwt as any

describe("register()", () => {
  beforeEach(() => vi.clearAllMocks())

  it("should register user successfully", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    bcryptMock.hash.mockResolvedValue("hashed")
    prismaMock.user.create.mockResolvedValue({
      id: "1",
      name: "John",
      email: "john@test.com",
      role: "CUSTOMER",
    })
    jwtMock.sign.mockReturnValue("token")

    const result = await register({
      name: "John",
      email: "john@test.com",
      password: "123",
    })

    expect(result.token).toBe("token")
    expect(result.user.email).toBe("john@test.com")
  })

  it("should fail if email exists", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "1" })

    await expect(
      register({
        name: "John",
        email: "john@test.com",
        password: "123",
      })
    ).rejects.toThrow("Email already in use")
  })

  it("should hash password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    bcryptMock.hash.mockResolvedValue("hashed")

    prismaMock.user.create.mockResolvedValue({
      id: "1",
      name: "John",
      email: "john@test.com",
      role: "CUSTOMER",
    })

    jwtMock.sign.mockReturnValue("token")

    await register({
      name: "John",
      email: "john@test.com",
      password: "123",
    })

    expect(bcryptMock.hash).toHaveBeenCalledWith("123", 10)
  })
})
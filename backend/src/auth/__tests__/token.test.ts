import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}))

import jwt from "jsonwebtoken"
import { readToken } from "../token"

const jwtMock = jwt as any

describe("readToken()", () => {
  beforeEach(() => vi.clearAllMocks())

  it("should decode token", () => {
    jwtMock.verify.mockReturnValue({
      id: "1",
      email: "test@test.com",
      role: "CUSTOMER",
    })

    const result = readToken("token")

    expect(result.id).toBe("1")
  })

  it("should throw invalid token", () => {
    jwtMock.verify.mockImplementation(() => {
      throw new Error("invalid")
    })

    expect(() => readToken("bad")).toThrow("invalid")
  })
})
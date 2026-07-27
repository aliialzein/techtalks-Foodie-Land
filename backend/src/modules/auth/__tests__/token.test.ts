import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}))

import jwt from "jsonwebtoken"
import { readAccessToken } from "../token"

const jwtMock = jwt as any

describe("readAccessToken()", () => {
  beforeEach(() => vi.clearAllMocks())

  it("should decode token", () => {
    jwtMock.verify.mockReturnValue({
      id: "1",
      email: "test@test.com",
      role: "CUSTOMER",
      type: "ACCESS",
    })

    const result = readAccessToken("token")
    expect(result.type).toBe("ACCESS");
    expect(result.id).toBe("1")
  })

  it("should throw invalid token", () => {
    jwtMock.verify.mockImplementation(() => {
      throw new Error("invalid")
    })

    expect(() => readAccessToken("bad")).toThrow("invalid")
  })
})
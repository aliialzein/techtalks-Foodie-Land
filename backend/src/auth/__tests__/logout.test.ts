import { describe, it, expect } from "vitest"
import { logout } from "../auth_service"

describe("logout()", () => {
  it("should return message", async () => {
    const result = await logout()

    expect(result.message).toBe(
      "Logged out. Delete your token on the client."
    )
  })
})
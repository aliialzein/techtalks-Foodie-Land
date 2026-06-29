import { NextResponse }  from "next/server"
import { logout }        from "@/auth/auth_service"

export async function POST() {
  const result = await logout()
  return NextResponse.json(result, { status: 200 })
}
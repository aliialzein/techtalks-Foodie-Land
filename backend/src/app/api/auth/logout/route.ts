import { NextResponse }  from "next/server"
import { logout }        from "@/auth/auth_service"

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await logout()
  return NextResponse.json(result, { status: 200 })
}
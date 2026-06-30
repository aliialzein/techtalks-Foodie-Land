import { NextRequest, NextResponse } from "next/server"
import {getMe }          from "@/auth/auth_service"
import {readToken} from  "@/auth/token"

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Please log in" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    const decoded = readToken(token)

    const user = await getMe(decoded.id)

    return NextResponse.json({ user }, { status: 200 })

  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
  }
}
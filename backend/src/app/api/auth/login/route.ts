import { NextRequest, NextResponse } from "next/server"
import { loginSchema }               from "@/auth/auth_schema"
import { login }                     from "@/auth/auth_service"

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()

    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await login(parsed.data)
    return NextResponse.json(result, { status: 200 })

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 })
  }
}
import { NextRequest, NextResponse } from "next/server"
import { registerSchema }            from "@/auth/auth_schema"
import { register }                  from "@/auth/auth_service"

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json()

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await register(parsed.data)

    return NextResponse.json(result, { status: 201 })

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 })
  }
}
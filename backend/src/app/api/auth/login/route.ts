import { NextRequest } from "next/server";
import { loginController } from "@/modules/auth/auth.controller";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return loginController(req);
}
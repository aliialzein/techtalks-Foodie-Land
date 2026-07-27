import { NextRequest } from "next/server";
import { forgotPasswordController } from "@/modules/password-reset/password-reset.controller";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return forgotPasswordController(req);
}
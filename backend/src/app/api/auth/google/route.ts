import { NextRequest } from "next/server";
import { googleController } from "@/modules/auth/auth.controller";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return googleController(req);
}
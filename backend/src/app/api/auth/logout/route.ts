import { logoutController } from "@/modules/auth/auth.controller";
export const dynamic = "force-dynamic";

export async function POST() {
  return logoutController();
}
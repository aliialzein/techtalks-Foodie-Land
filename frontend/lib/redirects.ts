"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserRole } from "./auth";

export function redirectAfterLogin(
  router: AppRouterInstance,
  user?: { role?: UserRole | null },
) {
  switch (user?.role) {
    case "OWNER":
      router.replace("/restaurant");
      break;

    case "ADMIN":
      router.replace("/admin");
      break;

    default:
      // Customers land on the home page after signing in (not a random menu).
      router.replace("/");
  }
}

export function redirectAfterLogout(
  router: AppRouterInstance,
) {
  router.replace("/login");
}
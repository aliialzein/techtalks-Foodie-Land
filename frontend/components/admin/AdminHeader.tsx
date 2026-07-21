"use client";

import Link from "next/link";
import { ChefHat, ShieldCheck } from "lucide-react";

type NavKey = "dashboard" | "restaurants";

export default function AdminHeader({
  dark,
  active,
}: {
  dark: boolean;
  active?: NavKey;
}) {
  const linkClass = (isActive: boolean) =>
    isActive
      ? "text-orange-500"
      : dark
      ? "text-white/55 hover:text-white"
      : "text-black/55 hover:text-black";

  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <Link href="/admin" className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-600 to-orange-400 shadow-[0_4px_12px_rgba(234,88,12,0.4)]">
          <ChefHat className="h-5 w-5 text-white" />
        </div>

        <span
          className={`text-[1.05rem] font-semibold tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          Foodie<span className="text-orange-600">Land</span>
        </span>
      </Link>

      <div className="flex items-center gap-5">
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link
            href="/admin"
            className={`transition-colors ${linkClass(
              active === "dashboard"
            )}`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/restaurants"
            className={`transition-colors ${linkClass(
              active === "restaurants"
            )}`}
          >
            Pending Restaurants
          </Link>
        </nav>

        <div
          className={`inline-flex h-10 items-center justify-center rounded-xl border px-4 ${
            dark
              ? "border-white/10 bg-white/5 text-white/70"
              : "border-black/10 bg-white/60 text-black/60"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-orange-500" />
        </div>
      </div>
    </header>
  );
}
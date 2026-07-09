"use client";

import { useRouter } from "next/navigation";
import { ChefHat, LogOut } from "lucide-react";
import { clearSession } from "@/lib/auth";

type NavKey = "dashboard" | "menu" | "orders";

export default function OwnerHeader({
  dark,
  active,
}: {
  dark: boolean;
  active?: NavKey;
}) {
  const router = useRouter();

  const logout = () => {
    clearSession();
    router.push("/login");
  };

  const linkClass = (isActive: boolean) =>
    isActive
      ? "text-orange-500"
      : dark
        ? "text-white/55 hover:text-white"
        : "text-black/55 hover:text-black";

  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <a href="/owner" className="flex items-center gap-2.5">
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
        <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-orange-500">
          Owner
        </span>
      </a>

      <nav className="flex items-center gap-3 text-sm font-medium sm:gap-5">
        <a
          href="/owner"
          className={`transition-colors ${linkClass(active === "dashboard")}`}
        >
          Dashboard
        </a>
        <a
          href="/owner/menu"
          className={`transition-colors ${linkClass(active === "menu")}`}
        >
          Menu
        </a>
        <a
          href="/owner/orders"
          className={`transition-colors ${linkClass(active === "orders")}`}
        >
          Orders
        </a>
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
            dark
              ? "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              : "border-black/10 bg-white/60 text-black/55 hover:bg-white/90"
          }`}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </nav>
    </header>
  );
}

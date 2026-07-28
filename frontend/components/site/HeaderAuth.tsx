"use client";
/* eslint-disable @next/next/no-img-element */

import { Globe, LogOut, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout, useCurrentUser } from "@/lib/auth";

// Auth-aware header actions. `marketing` matches the landing-page header
// (Sign in / Get Started), `app` matches the shared SiteHeader (globe/cart/user).
export default function HeaderAuth({
  variant = "app",
}: {
  variant?: "app" | "marketing";
}) {
  const user = useCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const firstName = user?.name?.split(" ")[0] ?? "";

  if (variant === "marketing") {
    return (
      <div className="flex items-center gap-3 font-[family-name:var(--font-inter)]">
        <img src="/home/globe.svg" alt="" className="hidden h-6 w-6 sm:block" />
        {user ? (
          <>
            <a href="/cart" aria-label="Cart" className="text-[#242424] transition-colors hover:text-[#d97a3a]">
              <ShoppingCart className="h-5 w-5" />
            </a>
            <span className="hidden text-sm font-medium text-[#242424] sm:inline">
              Hi, {firstName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-4 py-2.5 text-sm font-medium text-[#242424] transition-colors hover:bg-[#e6e6e6]"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-4 py-2.5 text-sm font-medium text-[#242424] transition-colors hover:bg-[#e6e6e6]"
            >
              Sign in
              <img src="/home/arrow-right.svg" alt="" className="h-4 w-4" />
            </a>
            <a
              href="/register"
              className="inline-flex items-center rounded-full bg-[#d97a3a] px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f]"
            >
              Get Started
            </a>
          </>
        )}
      </div>
    );
  }

  // app variant
  return (
    <div className="flex items-center gap-4 text-[#242424]">
      <Globe className="hidden h-5 w-5 text-black/70 sm:block" />
      <a href="/cart" aria-label="Cart" className="transition-colors hover:text-[#d97a3a]">
        <ShoppingCart className="h-5 w-5" />
      </a>
      {user ? (
        <>
          <span className="hidden text-sm font-medium sm:inline">{firstName}</span>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="transition-colors hover:text-[#d97a3a]"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </>
      ) : (
        <a href="/login" aria-label="Account" className="transition-colors hover:text-[#d97a3a]">
          <User className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}

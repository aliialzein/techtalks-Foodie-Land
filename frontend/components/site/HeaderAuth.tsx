"use client";

import { Globe, LogOut, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout, useCurrentUser } from "@/lib/auth";

// Single, consistent set of header actions used by SiteHeader on every
// customer-facing page. Signed out -> Sign in / Get Started; signed in ->
// cart + the user's name + Log out.
export default function HeaderAuth() {
  const user = useCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="flex items-center gap-3 font-[family-name:var(--font-inter)] text-[#242424]">
      <Globe className="hidden h-5 w-5 text-black/70 sm:block" />
      {user ? (
        <>
          <a
            href="/cart"
            aria-label="Cart"
            className="transition-colors hover:text-[#d97a3a]"
          >
            <ShoppingCart className="h-5 w-5" />
          </a>
          <span className="hidden text-sm font-medium sm:inline">Hi, {firstName}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-4 py-2 text-sm font-medium text-[#242424] transition-colors hover:bg-[#e6e6e6]"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </>
      ) : (
        <>
          <a
            href="/login"
            className="inline-flex items-center rounded-full bg-[#f0f0f0] px-5 py-2 text-sm font-medium text-[#242424] transition-colors hover:bg-[#e6e6e6]"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="inline-flex items-center rounded-full bg-[#d97a3a] px-5 py-2 text-sm font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f]"
          >
            Get Started
          </a>
        </>
      )}
    </div>
  );
}

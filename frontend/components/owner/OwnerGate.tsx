"use client";

import type { ReactNode } from "react";
import { LogIn, ShieldAlert } from "lucide-react";
import { useCurrentUser, type SessionUser } from "@/lib/auth";
import { useTheme } from "@/hooks/useTheme";
import OwnerHeader from "./OwnerHeader";

type NavKey = "dashboard" | "menu" | "orders";

// Wraps an owner page: renders the themed shell + header, guards on the OWNER
// role, and only mounts the child (with the verified owner) when allowed.
export default function OwnerGate({
  active,
  children,
}: {
  active?: NavKey;
  children: (ctx: { owner: SessionUser; dark: boolean }) => ReactNode;
}) {
  const theme = useTheme();
  const dark = theme !== "light";
  const user = useCurrentUser();
  const isOwner = user?.role === "OWNER" || user?.role === "ADMIN";

  const noticeCard = dark
    ? "border-white/8 bg-white/[0.03]"
    : "border-black/8 bg-white/50";
  const strongText = dark ? "text-white/80" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-4 py-12 transition-all duration-500 ${
        dark
          ? "bg-linear-to-br from-[#0f0f0f] via-[#1a0a00] to-[#0f0f0f]"
          : "bg-linear-to-br from-[#fff7f0] via-[#ffe8d6] to-[#fff3eb]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-24 -right-20 h-96 w-96 rounded-full blur-[80px] ${
          dark ? "bg-orange-600/20" : "bg-orange-500/15"
        }`}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <OwnerHeader dark={dark} active={active} />

        {!user ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${noticeCard}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <LogIn className="h-7 w-7 text-orange-500" />
            </div>
            <p className={`text-sm font-medium ${strongText}`}>
              Sign in to manage your restaurant
            </p>
            <a
              href="/login"
              className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
            >
              Go to sign in
            </a>
          </div>
        ) : !isOwner ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${noticeCard}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <ShieldAlert className="h-7 w-7 text-orange-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${strongText}`}>
                This area is for restaurant owners
              </p>
              <p className={`mt-1 text-xs ${mutedText}`}>
                Your account doesn&apos;t have owner access.
              </p>
            </div>
            <a
              href="/menu"
              className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
            >
              Back to the menu
            </a>
          </div>
        ) : (
          children({ owner: user, dark })
        )}
      </div>
    </div>
  );
}

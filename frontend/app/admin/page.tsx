"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Search,
  BadgeCheck,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/admin/AdminHeader";
import { useTheme } from "@/hooks/useTheme";

export default function AdminPage() {
  const theme = useTheme();
  const dark = theme !== "light";

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
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
          <AdminHeader dark={dark} active="dashboard" />

          <div className="mb-8">
            <p
              className={`text-sm font-medium uppercase tracking-[0.18em] ${
                dark ? "text-orange-400" : "text-orange-600"
              }`}
            >
              Admin
            </p>

            <h1
              className={`mt-2 text-3xl font-bold tracking-tight ${
                dark ? "text-white" : "text-gray-900"
              }`}
            >
              Restaurant Approval Center
            </h1>

            <p
              className={`mt-2 text-sm ${
                dark ? "text-white/40" : "text-black/45"
              }`}
            >
              Review restaurant submissions before publishing them on
              FoodieLand.
            </p>
          </div>

          <Link
            href="/admin/restaurants"
            className={`group block overflow-hidden rounded-2xl border backdrop-blur-xl transition-all hover:-translate-y-1 ${
              dark
                ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
                : "border-white/70 bg-white/60"
            }`}
          >
            <div className="flex h-36 items-center justify-center bg-linear-to-br from-orange-500/15 via-orange-400/10 to-orange-300/5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
                <ClipboardList className="h-9 w-9 text-orange-500" />
              </div>
            </div>

            <div className="p-5">
              <h2
                className={`text-lg font-semibold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
              >
                Pending Restaurants
              </h2>

              <p
                className={`mt-2 text-sm ${
                  dark ? "text-white/40" : "text-black/45"
                }`}
              >
                Review restaurants waiting for admin approval.
              </p>

              <div className="mt-5">
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] transition-all group-hover:-translate-y-px">
                  Open Approval Queue
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div
              className={`rounded-2xl border p-5 backdrop-blur-xl ${
                dark
                  ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
                  : "border-white/70 bg-white/60"
              }`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                <Search className="h-5 w-5 text-orange-600" />
              </div>

              <h3
                className={`text-sm font-semibold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
              >
                Review Requests
              </h3>

              <p
                className={`mt-1 text-xs ${
                  dark ? "text-white/40" : "text-black/45"
                }`}
              >
                Check restaurant information before approval.
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 backdrop-blur-xl ${
                dark
                  ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
                  : "border-white/70 bg-white/60"
              }`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                <BadgeCheck className="h-5 w-5 text-orange-600" />
              </div>

              <h3
                className={`text-sm font-semibold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
              >
                Approve Restaurants
              </h3>

              <p
                className={`mt-1 text-xs ${
                  dark ? "text-white/40" : "text-black/45"
                }`}
              >
                Publish verified restaurants to the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
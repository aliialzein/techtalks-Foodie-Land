"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="rounded-3xl border border-orange-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">Restaurant approval center</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600">
              Review new restaurant submissions and approve or reject them before they appear in the platform.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/restaurants"
              className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400"
            >
              <h2 className="text-lg font-semibold text-gray-900">Pending restaurants</h2>
              <p className="mt-2 text-sm text-gray-600">Approve or reject restaurants waiting for admin review.</p>
              <span className="mt-4 inline-flex text-sm font-medium text-orange-600">Open queue →</span>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

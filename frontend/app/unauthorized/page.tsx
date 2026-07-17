"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-orange-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
          <ShieldAlert className="h-7 w-7 text-orange-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Access denied</h1>
        <p className="mt-2 text-sm text-gray-600">
          You do not have permission to view this page.
        </p>
        <Link href="/menu" className="mt-6 inline-flex rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white">
          Back to home
        </Link>
      </div>
    </div>
  );
}

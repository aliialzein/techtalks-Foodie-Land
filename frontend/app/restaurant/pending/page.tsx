"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function RestaurantPendingPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
        <div className="w-full max-w-xl rounded-3xl border border-orange-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Registration submitted</h1>
          <p className="mt-3 text-sm text-gray-600">Your restaurant registration has been submitted. Waiting for admin approval.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

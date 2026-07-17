"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function RestaurantDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
        <div className="w-full max-w-xl rounded-3xl border border-orange-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Restaurant dashboard</h1>
          <p className="mt-3 text-sm text-gray-600">Your restaurant has been approved and is ready to manage.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

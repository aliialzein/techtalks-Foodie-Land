"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, useCurrentUser } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RestaurantRegisterPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <RestaurantRegisterContent />
    </ProtectedRoute>
  );
}

function RestaurantRegisterContent() {
  const router = useRouter();
  const user = useCurrentUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!user?.id) {
      setError("Please sign in again.");
      return;
    }

    setLoading(true);

    try {
      const session = getSession();
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token ?? ""}`,
        },
        body: JSON.stringify({
          ownerId: user.id,
          name,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Unable to create your restaurant right now.");
        return;
      }

      router.replace("/restaurant/pending");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-orange-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Register your restaurant</h1>
        <p className="mt-2 text-sm text-gray-600">A short onboarding form to get started.</p>

        {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Restaurant Name</label>
            <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Submitting..." : "Submit for approval"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getSession } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

type RestaurantListItem = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
};

export default function AdminRestaurantsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminRestaurantsContent />
    </ProtectedRoute>
  );
}

function AdminRestaurantsContent() {
  const [restaurants, setRestaurants] = useState<RestaurantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const loadPendingRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      const session = getSession();
      const data = await apiRequest<RestaurantListItem[]>("/api/restaurants/pending", {
        headers: {
          Authorization: `Bearer ${session?.token ?? ""}`,
        },
      });
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load pending restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPendingRestaurants();
  }, []);

  const handleApprove = async (restaurantId: string) => {
    setBusyId(restaurantId);
    setError("");
    setMessage("");

    try {
      const session = getSession();
      await apiRequest(`/api/restaurants/${restaurantId}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.token ?? ""}`,
        },
      });
      setRestaurants((current) => current.filter((restaurant) => restaurant.id !== restaurantId));
      setMessage("Restaurant approved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to approve the restaurant.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (restaurantId: string) => {
    if (!reason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    setBusyId(restaurantId);
    setError("");
    setMessage("");

    try {
      const session = getSession();
      await apiRequest(`/api/restaurants/${restaurantId}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.token ?? ""}`,
        },
        body: JSON.stringify({ rejectionReason: reason.trim() }),
      });
      setRestaurants((current) => current.filter((restaurant) => restaurant.id !== restaurantId));
      setMessage("Restaurant rejected successfully.");
      setReason("");
      setRejectingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reject the restaurant.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-orange-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Admin</p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">Pending restaurant approvals</h1>
              <p className="mt-2 text-sm text-gray-600">Review each restaurant request before approving it for public access.</p>
            </div>
            <a href="/admin" className="text-sm font-medium text-orange-600">← Back to dashboard</a>
          </div>

          {message ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-10 flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-sm text-gray-600">Loading pending restaurants…</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-orange-200 bg-orange-50/70 px-6 py-16 text-center text-sm text-gray-600">
              No pending restaurants right now.
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">{restaurant.name}</h2>
                        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">{restaurant.status}</span>
                      </div>
                      <p className="max-w-2xl text-sm text-gray-600">{restaurant.description || "No description provided."}</p>
                      <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div>
                          <p className="font-medium text-gray-900">Owner</p>
                          <p>{restaurant.owner.name}</p>
                          <p className="text-xs text-gray-500">{restaurant.owner.email}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Submitted</p>
                          <p>{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                      <button
                        type="button"
                        onClick={() => void handleApprove(restaurant.id)}
                        disabled={busyId === restaurant.id}
                        className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
                      >
                        {busyId === restaurant.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectingId(rejectingId === restaurant.id ? null : restaurant.id)}
                        disabled={busyId === restaurant.id}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {rejectingId === restaurant.id ? (
                    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Rejection reason</label>
                      <textarea
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                        placeholder="Tell the owner why the restaurant was rejected"
                      />
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReason("");
                            setRejectingId(null);
                          }}
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleReject(restaurant.id)}
                          disabled={busyId === restaurant.id}
                          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                          {busyId === restaurant.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit rejection"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

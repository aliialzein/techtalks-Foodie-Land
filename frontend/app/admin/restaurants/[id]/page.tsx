"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Store, CalendarDays, Loader2 } from "lucide-react";

import { getSession } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

export default function RestaurantInfoPage() {
  // Mock data (temporary)
 const { id } = useParams();

const [restaurant, setRestaurant] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [message, setMessage] = useState("");
const [busy, setBusy] = useState(false);
const [reason, setReason] = useState("");

useEffect(() => {
  const loadRestaurant = async () => {
    try {
      const session = getSession();

      const data = await apiRequest(`/api/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.token ?? ""}`,
        },
      });

      setRestaurant(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load restaurant."
      );
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    void loadRestaurant();
  }
}, [id]);

const handleApprove = async () => {
  if (!restaurant) return;

  setBusy(true);
  setError("");
  setMessage("");

  try {
    const session = getSession();

    await apiRequest(`/api/restaurants/${restaurant.id}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.token ?? ""}`,
      },
    });

    setRestaurant({
      ...restaurant,
      status: "APPROVED",
    });

    setMessage("Restaurant approved successfully.");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to approve the restaurant."
    );
  } finally {
    setBusy(false);
  }
};

const handleReject = async () => {
  if (!restaurant) return;

  setBusy(true);
  setError("");
  setMessage("");

  try {
    const session = getSession();

    await apiRequest(`/api/restaurants/${restaurant.id}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.token ?? ""}`,
      },
      body: JSON.stringify({
        rejectionReason: reason.trim(),
      }),
    });

    setRestaurant({
      ...restaurant,
      status: "REJECTED",
    });

    setMessage("Restaurant rejected successfully.");
    setReason("");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to reject the restaurant."
    );
  } finally {
    setBusy(false);
  }
};

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-600">{error}</p>
    </div>
  );
}

if (!restaurant) {
  return null;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f0] via-[#ffe8d6] to-[#fff3eb] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/restaurants"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pending Restaurants
        </Link>

        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/60 shadow-lg backdrop-blur-xl">
          <div className="flex h-52 items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-400/5">
            <Store className="h-16 w-16 text-orange-500" />
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>

              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                {restaurant.status}
              </span>
            </div>

            <p className="mt-5 leading-7 text-gray-600">
              {restaurant.description}
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="flex gap-3">
                <CalendarDays className="mt-1 h-5 w-5 text-orange-600" />

                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(restaurant.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
                <button
                   onClick={() => void handleApprove()}
                   disabled={busy}
                   className="flex-1 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {busy ? (
                     <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    "Approve Restaurant"
                  )}
               </button>
              

               <button
                    onClick={() => void handleReject()}
                    disabled={busy}
                    className="flex-1 rounded-xl border border-red-300 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                    {busy ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    ) : (
                      "Reject Restaurant"
                    )}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
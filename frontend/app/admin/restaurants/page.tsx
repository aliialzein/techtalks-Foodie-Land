"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, FileDown, Loader2, Store } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getSession } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import AdminFooter from "@/components/admin/AdminFooter";
import { generatePdfReport } from "@/lib/pdf";

type RestaurantListItem = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  owner: { id: string; name: string; email: string };
};

const FILTERS = ["All Status", "Pending", "Accepted"] as const;
type Filter = (typeof FILTERS)[number];

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
  const [filter, setFilter] = useState<Filter>("All Status");
  const router = useRouter();

  const loadPendingRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      const session = getSession();
      const data = await apiRequest<RestaurantListItem[]>("/api/restaurants/pending", {
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
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
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
      });
      setRestaurants((current) => current.filter((r) => r.id !== restaurantId));
      setMessage("Restaurant approved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to approve the restaurant.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (restaurantId: string) => {
    setBusyId(restaurantId);
    setError("");
    setMessage("");
    try {
      const session = getSession();
      await apiRequest(`/api/restaurants/${restaurantId}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
        body: JSON.stringify({ rejectionReason: "Rejected by admin." }),
      });
      setRestaurants((current) => current.filter((r) => r.id !== restaurantId));
      setMessage("Restaurant rejected successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reject the restaurant.");
    } finally {
      setBusyId(null);
    }
  };

  const isAccepted = filter === "Accepted";

  const exportApplicationsPdf = () => {
    generatePdfReport({
      title: "Restaurant Applications",
      subtitle: "Pending partnership requests submitted to FoodSpot.",
      fileName: "foodspot-admin-restaurant-applications.pdf",
      sections: [
        {
          type: "stats",
          items: [{ label: "Pending Applications", value: String(restaurants.length) }],
        },
        {
          type: "table",
          title: "Applications",
          head: ["Restaurant", "Owner", "Owner Email", "Status", "Submitted"],
          body: restaurants.map((r) => [
            r.name,
            r.owner.name,
            r.owner.email,
            r.status,
            new Date(r.createdAt).toLocaleDateString(),
          ]),
        },
      ],
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <AdminPanelHeader active="applications" />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-[#1a1c1c] lg:text-[34px]">Applications</h1>
          <p className="mt-2 text-[16px] text-[#5f5e5e]">
            Review and manage restaurant partnership requests submitted to FoodSpot.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 font-[family-name:var(--font-inter)] text-[14px]">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? "rounded-full bg-[#d97a3a] px-5 py-2 font-medium text-white"
                    : "rounded-full border border-[#e2e2e2] px-5 py-2 text-[#636262] transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a]"
                }
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportApplicationsPdf}
              disabled={loading || isAccepted || restaurants.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e2e2e2] bg-white px-4 py-2 text-[14px] font-semibold text-[#242424] transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FileDown className="h-4 w-4" /> Export to PDF
            </button>
            <span className="inline-flex cursor-default items-center gap-1.5 rounded-lg border border-[#e2e2e2] px-4 py-2 text-[14px] text-[#636262]">
              Sort By <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-[#eef0f3] bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#1a1c1c]">New Applications</h2>
            {!isAccepted && restaurants.length > 0 && (
              <span className="rounded-full bg-[#fbe7d8] px-3 py-1 text-[12px] font-semibold text-[#d97a3a]">
                {restaurants.length} Pending
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <Loader2 className="h-7 w-7 animate-spin text-[#d97a3a]" />
              <p className="text-sm text-[#8a8a8a]">Loading applications…</p>
            </div>
          ) : isAccepted ? (
            <p className="py-16 text-center text-sm text-[#8a8a8a]">
              Accepted applications aren&apos;t shown in this queue.
            </p>
          ) : restaurants.length === 0 ? (
            <p className="py-16 text-center text-sm text-[#8a8a8a]">
              No pending applications right now.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  onClick={() => router.push(`/admin/restaurants/${r.id}`)}
                  className="flex cursor-pointer flex-col rounded-xl border border-[#eef0f3] bg-[#fbfaf9] p-4 transition-colors hover:border-[#d97a3a]"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f8ddc9]">
                      <Store className="h-5 w-5 text-[#d97a3a]" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-bold text-[#181818]">{r.name}</p>
                      <p className="truncate text-[12px] text-[#8a8a8a]">
                        {r.description || r.owner.name}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 flex gap-2 font-[family-name:var(--font-inter)] text-[13px]"
                  >
                    <button
                      type="button"
                      onClick={() => void handleApprove(r.id)}
                      disabled={busyId === r.id}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#f6c9a6] px-3 py-2 font-semibold text-[#8a3b13] transition-colors hover:bg-[#f0b98d] disabled:opacity-60"
                    >
                      {busyId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleReject(r.id)}
                      disabled={busyId === r.id}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#e2e2e2] bg-white px-3 py-2 font-medium text-[#636262] transition-colors hover:border-red-300 hover:text-red-500 disabled:opacity-60"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !isAccepted && restaurants.length > 6 && (
            <div className="mt-6 flex justify-center">
              <span className="inline-flex cursor-default items-center gap-1.5 text-[14px] font-medium text-[#8a8a8a]">
                Show More Applications <ChevronDown className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}

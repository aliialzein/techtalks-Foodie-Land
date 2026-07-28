"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDown, Loader2, Store } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import AdminFooter from "@/components/admin/AdminFooter";
import { generatePdfReport } from "@/lib/pdf";
import { getRestaurants, type Restaurant } from "@/lib/restaurants";

export default function AdminOverviewPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Overview />
    </ProtectedRoute>
  );
}

function pillClass(status?: string) {
  const s = (status ?? "").toUpperCase();
  if (s === "APPROVED") return "bg-green-50 text-green-600";
  if (s === "REJECTED") return "bg-red-50 text-red-500";
  return "bg-[#fde0d3] text-[#d97a3a]";
}

function Overview() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRestaurants(await getRestaurants());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const approved = useMemo(
    () => restaurants.filter((r) => (r.status ?? "").toUpperCase() === "APPROVED").length,
    [restaurants],
  );
  const pending = useMemo(
    () => restaurants.filter((r) => (r.status ?? "").toUpperCase() === "PENDING").length,
    [restaurants],
  );

  const exportPdf = () => {
    generatePdfReport({
      title: "Operations Overview",
      subtitle: "Restaurants registered on FoodSpot.",
      fileName: "foodspot-admin-overview.pdf",
      sections: [
        {
          type: "stats",
          items: [
            { label: "Total Restaurants", value: String(restaurants.length) },
            { label: "Approved", value: String(approved) },
            { label: "Pending", value: String(pending) },
          ],
        },
        {
          type: "table",
          title: "Restaurants",
          head: ["Name", "Owner", "Status", "Registered"],
          body: restaurants.map((r) => [
            r.name,
            r.owner?.name ?? "—",
            r.status ?? "—",
            new Date(r.createdAt).toLocaleDateString(),
          ]),
        },
      ],
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <AdminPanelHeader active="overview" />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-[#1a1c1c] lg:text-[34px]">Overview</h1>
          <p className="mt-2 text-[16px] text-[#5f5e5e]">
            Real-time performance metrics for FoodSpot operations.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={exportPdf}
            disabled={loading || restaurants.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e2e2e2] bg-white px-5 py-2.5 font-[family-name:var(--font-inter)] text-[14px] font-semibold text-[#242424] transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileDown className="h-4 w-4" /> Export to PDF
          </button>
        </div>

        {/* Stat cards (real counts) */}
        <div className="mx-auto mt-8 grid max-w-[820px] gap-6 sm:grid-cols-3">
          <StatCard label="Total Restaurants" value={String(restaurants.length)} />
          <StatCard label="Approved" value={String(approved)} />
          <StatCard label="Pending" value={String(pending)} />
        </div>

        {/* Restaurants table (real data) */}
        <div className="mx-auto mt-6 max-w-[820px] rounded-xl border border-[#eef0f3] bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#1a1c1c]">Restaurants</h2>
            <a href="/admin/restaurants" className="text-[14px] font-semibold text-[#d97a3a] hover:underline">
              View All
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-[#d97a3a]" />
            </div>
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-600">{error}</p>
          ) : restaurants.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#8a8a8a]">No restaurants registered yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-[#eef0f3] text-[12px] uppercase tracking-wide text-[#8a8a8a]">
                    <th className="py-3 pr-4 font-semibold">Restaurant Name</th>
                    <th className="px-4 py-3 font-semibold">Owner</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="py-3 pl-4 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((r) => (
                    <tr key={r.id} className="border-b border-[#f4f4f4] last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f8ddc9]">
                            <Store className="h-4 w-4 text-[#d97a3a]" />
                          </span>
                          <span className="text-[14px] font-medium text-[#242424]">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[14px] text-[#5f5e5e]">{r.owner?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${pillClass(r.status)}`}>
                          {r.status ?? "—"}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-[14px] text-[#5f5e5e]">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#f0dccb] bg-white p-6 text-center shadow-[0_6px_24px_rgba(17,17,17,0.04)]">
      <p className="text-[14px] text-[#8a8a8a]">{label}</p>
      <p className="mt-1 text-[28px] font-bold text-[#1a1c1c]">{value}</p>
    </div>
  );
}

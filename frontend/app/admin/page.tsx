"use client";
/* eslint-disable @next/next/no-img-element */

import { Receipt, ShoppingBag, Star, Trash2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import AdminFooter from "@/components/admin/AdminFooter";

const ROWS = [
  { name: "Giacomo Italian Bistro", orders: "1,428", revenue: "$47,506", rating: "4.9" },
  { name: "SushiMaster Zen", orders: "980", revenue: "$32,109", rating: "4.8" },
  { name: "The Europe Loft", orders: "2,109", revenue: "$25,809", rating: "4.7" },
  { name: "Mesri Thai Street", orders: "810", revenue: "$20,438", rating: "4.6" },
];

export default function AdminOverviewPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
        <AdminPanelHeader active="overview" />

        <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-[28px] font-bold text-[#1a1c1c] lg:text-[34px]">Overview</h1>
            <p className="mt-2 text-[16px] text-[#5f5e5e]">
              Real-time performance metrics for FoodSpot operations.
            </p>
          </div>

          {/* Stat cards */}
          <div className="mx-auto mt-8 grid max-w-[720px] gap-6 sm:grid-cols-2">
            <StatCard
              icon={<Receipt className="h-5 w-5 text-[#d97a3a]" />}
              delta="+12.5%"
              label="Total Revenue"
              value="$1,284,530"
            />
            <StatCard
              icon={<ShoppingBag className="h-5 w-5 text-[#d97a3a]" />}
              delta="+8.2%"
              label="Total Orders"
              value="45,102"
            />
          </div>

          {/* Restaurants table */}
          <div className="mx-auto mt-6 max-w-[820px] rounded-xl border border-[#eef0f3] bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#1a1c1c]">Resturants</h2>
              <a href="/admin/restaurants" className="text-[14px] font-semibold text-[#d97a3a] hover:underline">
                View All
              </a>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-[#eef0f3] text-[12px] uppercase tracking-wide text-[#8a8a8a]">
                    <th className="py-3 pr-4 font-semibold">Restaurant Name</th>
                    <th className="px-4 py-3 font-semibold">Total Orders</th>
                    <th className="px-4 py-3 font-semibold">Total Revenue</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="py-3 pl-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.name} className="border-b border-[#f4f4f4] last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img src="/home/menu-plate.jpg" alt="" className="h-9 w-9 rounded-lg object-cover" />
                          <span className="text-[14px] font-medium text-[#242424]">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[14px] tabular-nums text-[#5f5e5e]">{r.orders}</td>
                      <td className="px-4 py-3 text-[14px] font-semibold tabular-nums text-[#d97a3a]">{r.revenue}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[14px] text-[#5f5e5e]">
                          <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
                          {r.rating}
                        </span>
                      </td>
                      <td className="py-3 pl-4">
                        <button
                          type="button"
                          aria-label="Remove"
                          className="text-[#8a8a8a] transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-[18px] w-[18px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <AdminFooter />
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  icon,
  delta,
  label,
  value,
}: {
  icon: React.ReactNode;
  delta: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#f0dccb] bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.04)]">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f8ddc9]">{icon}</div>
        <span className="rounded-md bg-[#fbe7d8] px-2 py-1 text-[12px] font-semibold text-[#d97a3a]">
          {delta}
        </span>
      </div>
      <p className="mt-4 text-[14px] text-[#8a8a8a]">{label}</p>
      <p className="mt-1 text-[28px] font-bold text-[#1a1c1c]">{value}</p>
    </div>
  );
}

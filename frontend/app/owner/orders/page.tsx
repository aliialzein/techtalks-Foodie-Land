"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  LogIn,
  Printer,
  ShieldAlert,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";
import { useCurrentUser } from "@/lib/auth";
import { useOwnerRestaurants } from "@/hooks/useOwnerRestaurants";
import {
  getRestaurantOrders,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import PanelHeader from "@/components/owner/PanelHeader";

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  PENDING: { status: "PREPARING", label: "Start preparing" },
  PREPARING: { status: "READY", label: "Mark ready" },
  READY: { status: "DELIVERED", label: "Mark delivered" },
};

const FILTERS = ["All", "Completed", "Pending", "Canceled"] as const;
type Filter = (typeof FILTERS)[number];

function statusPill(status: OrderStatus): { label: string; cls: string } {
  switch (status) {
    case "DELIVERED":
      return { label: "Completed", cls: "bg-green-50 text-green-600" };
    case "CANCELLED":
      return { label: "Cancelled", cls: "bg-red-50 text-red-500" };
    case "READY":
      return { label: "Ready", cls: "bg-blue-50 text-blue-600" };
    case "PREPARING":
      return { label: "Preparing", cls: "bg-amber-50 text-amber-600" };
    default:
      return { label: "Pending", cls: "bg-[#fde0d3] text-[#d97a3a]" };
  }
}

function matchesFilter(status: OrderStatus, filter: Filter): boolean {
  if (filter === "All") return true;
  if (filter === "Completed") return status === "DELIVERED";
  if (filter === "Canceled") return status === "CANCELLED";
  return status === "PENDING" || status === "PREPARING" || status === "READY";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function OwnerOrdersPage() {
  const user = useCurrentUser();
  const isOwner = user?.role === "OWNER" || user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <PanelHeader active="orders" />
      {!user ? (
        <Notice
          icon={<LogIn className="h-7 w-7 text-[#d97a3a]" />}
          title="Sign in to manage your restaurant"
          cta="Go to sign in"
          href="/login"
        />
      ) : !isOwner ? (
        <Notice
          icon={<ShieldAlert className="h-7 w-7 text-[#d97a3a]" />}
          title="This area is for restaurant owners"
          cta="Back to the menu"
          href="/menu"
        />
      ) : (
        <Orders />
      )}
      <PanelFooter />
    </div>
  );
}

function Orders() {
  const { restaurants, loading: restLoading } = useOwnerRestaurants();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("restaurantId");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromUrl) setSelectedId(fromUrl);
  }, []);

  const activeId = selectedId ?? restaurants[0]?.id ?? null;
  const activeRestaurant = restaurants.find((r) => r.id === activeId) ?? restaurants[0];

  const load = useCallback(async (restaurantId: string) => {
    setLoading(true);
    try {
      setOrders(await getRestaurantOrders(restaurantId));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(activeId);
  }, [activeId, load]);

  const advance = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setAdvancingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, next.status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
    } catch {
      /* ignore */
    } finally {
      setAdvancingId(null);
    }
  };

  const visible = useMemo(
    () => orders.filter((o) => matchesFilter(o.status, filter)),
    [orders, filter],
  );

  if (restLoading) {
    return (
      <main className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#d97a3a]" />
      </main>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Notice
        icon={<Store className="h-7 w-7 text-[#d97a3a]" />}
        title="No restaurant yet"
        cta="Create one"
        href="/owner"
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
      <h1 className="text-center text-[28px] font-bold text-[#1a1c1c] lg:text-[34px]">
        Welcome {(activeRestaurant?.name ?? "back").toUpperCase()} !
      </h1>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold text-[#1a1c1c]">Recent Orders</h2>
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
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#eef0f3] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#eef0f3] bg-[#faf8f7] text-[12px] uppercase tracking-wide text-[#8a8a8a]">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer Name</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Total Price</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#d97a3a]" />
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-[#8a8a8a]">
                    No orders to show.
                  </td>
                </tr>
              ) : (
                visible.map((order) => {
                  const pill = statusPill(order.status);
                  const next = NEXT_STATUS[order.status];
                  return (
                    <tr key={order.id} className="border-b border-[#f4f4f4] last:border-0">
                      <td className="px-6 py-4 text-[14px] font-medium text-[#181818]">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8ddc9] text-[11px] font-bold text-[#d97a3a]">
                            {initials(order.user.name)}
                          </span>
                          <span className="text-[14px] text-[#242424]">{order.user.name}</span>
                        </div>
                      </td>
                      <td className="max-w-[220px] px-6 py-4 text-[14px] text-[#666]">
                        {order.items
                          .map((i) => (i.quantity > 1 ? `${i.nameSnapshot} x${i.quantity}` : i.nameSnapshot))
                          .join(", ")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${pill.cls}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {pill.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold tabular-nums text-[#181818]">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-[#8a8a8a]">
                          {next ? (
                            <button
                              type="button"
                              onClick={() => advance(order)}
                              disabled={advancingId === order.id}
                              title={next.label}
                              aria-label={next.label}
                              className="text-[#d97a3a] transition-colors hover:text-[#cc6d2f] disabled:opacity-40"
                            >
                              {advancingId === order.id ? (
                                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                              ) : (
                                <ArrowRight className="h-[18px] w-[18px]" />
                              )}
                            </button>
                          ) : (
                            <Eye className="h-[18px] w-[18px] text-[#d97a3a]" />
                          )}
                          <Printer className="h-[18px] w-[18px] transition-colors hover:text-[#242424]" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#eef0f3] bg-[#faf8f7] px-6 py-3 text-[13px] text-[#8a8a8a]">
          <span>
            Showing {visible.length} of {orders.length} orders
          </span>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e2e2e2]">
              <ChevronLeft className="h-4 w-4" />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#d97a3a] text-white">1</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e2e2e2]">
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Insight cards ---------- */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#eef0f3] bg-white p-6">
          <span className="rounded-full bg-[#f1efee] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8a8a8a]">
            Insights
          </span>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-[20px] font-bold leading-tight text-[#1a1c1c]">
                Optimize Delivery Speed
              </h3>
              <p className="mt-2 text-[14px] leading-6 text-[#666]">
                Orders with Truffle Fries are currently taking 15% longer than
                average. Consider prepping in batches during peak hours to
                improve customer satisfaction.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#8a3b13] px-4 py-2 font-[family-name:var(--font-inter)] text-[13px] font-semibold text-white transition-colors hover:bg-[#743210]"
              >
                <TrendingUp className="h-4 w-4" /> View Trends
              </button>
            </div>
            <div className="hidden h-[130px] w-[180px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#111] sm:flex">
              <TrendingUp className="h-8 w-8 text-[#d97a3a]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-xl bg-[#e8703a] p-6 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Star className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-[20px] font-bold">Daily Goal</h3>
          <p className="mt-2 text-[14px] leading-6 text-white/90">
            You are at 85% of your target revenue today. Just $1,200 more to
            unlock the staff bonus!
          </p>
          <div className="mt-auto pt-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-[85%] rounded-full bg-white" />
            </div>
            <div className="mt-2 flex justify-between text-[13px] font-medium">
              <span>$10,250</span>
              <span>$12,000</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Notice({
  icon,
  title,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  cta: string;
  href: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-[#eef0f3] bg-white py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8ddc9]">
          {icon}
        </div>
        <p className="text-[15px] font-medium text-[#242424]">{title}</p>
        <a
          href={href}
          className="rounded-full bg-[#d97a3a] px-6 py-2.5 font-[family-name:var(--font-inter)] text-sm font-bold text-white transition-colors hover:bg-[#cc6d2f]"
        >
          {cta}
        </a>
      </div>
    </main>
  );
}

function PanelFooter() {
  return (
    <footer className="border-t border-[#eef0f3] bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center gap-3 px-6 py-5 text-[13px] text-[#8a8a8a]">
        <img src="/home/logo.png" alt="FoodSpot" className="h-6 w-auto" />
        <span>© 2026 Food Spot — Restaurant Admin Panel. All rights reserved.</span>
      </div>
    </footer>
  );
}

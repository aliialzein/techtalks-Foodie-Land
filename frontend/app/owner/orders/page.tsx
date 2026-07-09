"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ArrowRight, ClipboardList, Loader2, Store } from "lucide-react";
import { useOwnerRestaurants } from "@/hooks/useOwnerRestaurants";
import {
  getRestaurantOrders,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import StatusBadge from "@/components/orders/StatusBadge";
import OwnerGate from "@/components/owner/OwnerGate";

const NEXT_STATUS: Partial<
  Record<OrderStatus, { status: OrderStatus; label: string }>
> = {
  PENDING: { status: "PREPARING", label: "Start preparing" },
  PREPARING: { status: "READY", label: "Mark ready" },
  READY: { status: "DELIVERED", label: "Mark delivered" },
};

export default function OwnerOrdersPage() {
  return (
    <OwnerGate active="orders">
      {({ dark }) => <OwnerOrders dark={dark} />}
    </OwnerGate>
  );
}

function OwnerOrders({ dark }: { dark: boolean }) {
  const { restaurants, loading: restLoading } = useOwnerRestaurants();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get(
      "restaurantId",
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromUrl) setSelectedId(fromUrl);
  }, []);

  const activeId = selectedId ?? restaurants[0]?.id ?? null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const strongText = dark ? "text-white" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";
  const cardClass = dark
    ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
    : "border-white/70 bg-white/60";

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
    setActionError("");
    try {
      const updated = await updateOrderStatus(order.id, next.status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update the order.",
      );
    } finally {
      setAdvancingId(null);
    }
  };

  if (restLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${cardClass}`}
      >
        <Store className="h-8 w-8 text-orange-500" />
        <p className={`text-sm font-medium ${strongText}`}>No restaurant yet</p>
        <a
          href="/owner"
          className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
        >
          Create one
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-semibold tracking-tight ${strongText}`}>
            Incoming orders
          </h1>
          <p className={`text-sm ${mutedText}`}>
            Track and advance orders as you prepare them
          </p>
        </div>
        {restaurants.length > 1 && (
          <select
            value={activeId ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
            className={`rounded-xl border px-3 py-2 text-sm outline-none ${
              dark
                ? "border-white/10 bg-white/5 text-white"
                : "border-black/10 bg-white/70 text-gray-900"
            }`}
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {actionError && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
            dark
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
        </div>
      ) : orders.length === 0 ? (
        <div
          className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${cardClass}`}
        >
          <ClipboardList className="h-8 w-8 text-orange-500" />
          <p className={`text-sm font-medium ${strongText}`}>No orders yet</p>
          <p className={`text-xs ${mutedText}`}>
            New orders from customers will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const next = NEXT_STATUS[order.status];
            return (
              <div
                key={order.id}
                className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${strongText}`}>
                      {order.user.name}
                    </p>
                    <p className={`text-[0.7rem] ${mutedText}`}>
                      #{order.id.slice(0, 8)} ·{" "}
                      {new Date(order.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} dark={dark} />
                </div>

                <ul className="mt-3 flex flex-col gap-1">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-center justify-between text-sm ${mutedText}`}
                    >
                      <span>
                        {item.nameSnapshot}{" "}
                        <span className="text-xs">×{item.quantity}</span>
                      </span>
                      <span className="tabular-nums">
                        ${(item.priceSnapshot * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-4 flex items-center justify-between border-t pt-4 ${
                    dark ? "border-white/8" : "border-black/8"
                  }`}
                >
                  <span className={`text-sm font-semibold tabular-nums ${strongText}`}>
                    ${order.totalPrice.toFixed(2)}
                  </span>
                  {next && (
                    <button
                      type="button"
                      onClick={() => advance(order)}
                      disabled={advancingId === order.id}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {advancingId === order.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5" />
                      )}
                      {next.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

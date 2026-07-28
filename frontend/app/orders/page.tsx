"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Loader2,
  LogIn,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { cancelOrder, getOrders, type Order } from "@/lib/orders";
import { useCurrentUser } from "@/lib/auth";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import OrderCard from "@/components/orders/OrderCard";

export default function OrdersPage() {
  const dark = false;
  const user = useCurrentUser();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async (userId: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getOrders(userId);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load the signed-in user's orders on mount. With no session yet, just drop
    // the loading state so the sign-in prompt can show.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (user) {
      void load(user.id);
    } else {
      setLoading(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user, load]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    setActionError("");
    try {
      const updated = await cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to cancel the order.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1
              className={`text-2xl font-semibold tracking-tight ${
                dark ? "text-white" : "text-gray-900"
              }`}
            >
              My Orders
            </h1>
            <p className={`text-sm ${dark ? "text-white/40" : "text-black/45"}`}>
              Track your orders and their status
            </p>
          </div>

          <button
            type="button"
            onClick={() => user && load(user.id)}
            disabled={loading || !user}
            aria-label="Refresh orders"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors disabled:opacity-50 ${
              dark
                ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                : "border-black/10 bg-white/60 text-black/60 hover:bg-white/90"
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </header>

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
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className={`text-sm ${dark ? "text-white/40" : "text-black/45"}`}>
              Loading your orders…
            </p>
          </div>
        ) : !user ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${
              dark
                ? "border-white/8 bg-white/[0.03]"
                : "border-black/8 bg-white/50"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <LogIn className="h-7 w-7 text-orange-500" />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  dark ? "text-white/80" : "text-gray-900"
                }`}
              >
                Sign in to view your orders
              </p>
              <p
                className={`mt-1 text-xs ${
                  dark ? "text-white/40" : "text-black/45"
                }`}
              >
                You need to be logged in to see your order history.
              </p>
            </div>
            <a
              href="/login"
              className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
            >
              Go to sign in
            </a>
          </div>
        ) : error ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${
              dark
                ? "border-white/8 bg-white/[0.03]"
                : "border-black/8 bg-white/50"
            }`}
          >
            <AlertCircle className="h-9 w-9 text-red-500" />
            <div>
              <p
                className={`text-sm font-medium ${
                  dark ? "text-white/80" : "text-gray-900"
                }`}
              >
                Couldn&apos;t load your orders
              </p>
              <p
                className={`mt-1 text-xs ${
                  dark ? "text-white/40" : "text-black/45"
                }`}
              >
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={() => user && load(user.id)}
              className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div
            className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${
              dark
                ? "border-white/8 bg-white/[0.03]"
                : "border-black/8 bg-white/50"
            }`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                dark ? "bg-orange-500/10" : "bg-orange-500/10"
              }`}
            >
              <ShoppingBag className="h-7 w-7 text-orange-500" />
            </div>
            <p
              className={`text-sm font-medium ${
                dark ? "text-white/80" : "text-gray-900"
              }`}
            >
              No orders yet
            </p>
            <p className={`text-xs ${dark ? "text-white/40" : "text-black/45"}`}>
              Your orders will appear here once you place one.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                dark={dark}
                onCancel={handleCancel}
                cancelling={cancellingId === order.id}
              />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

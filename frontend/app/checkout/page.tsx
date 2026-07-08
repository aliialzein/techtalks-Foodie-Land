"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogIn,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import { placeOrder } from "@/lib/checkout";
import type { Order } from "@/lib/orders";
import AppHeader from "@/components/AppHeader";

export default function CheckoutPage() {
  const theme = useTheme();
  const dark = theme !== "light";
  const { user, items, count, subtotal, loading } = useCart();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);

  const cardClass = dark
    ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
    : "border-white/70 bg-white/60";
  const strongText = dark ? "text-white" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";

  const handlePlace = async () => {
    if (!user) return;
    setPlacing(true);
    setError("");
    try {
      setPlaced(await placeOrder(user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place your order.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-4 py-12 transition-all duration-500 ${
        dark
          ? "bg-linear-to-br from-[#0f0f0f] via-[#1a0a00] to-[#0f0f0f]"
          : "bg-linear-to-br from-[#fff7f0] via-[#ffe8d6] to-[#fff3eb]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-24 -right-20 h-96 w-96 rounded-full blur-[80px] ${
          dark ? "bg-orange-600/20" : "bg-orange-500/15"
        }`}
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <AppHeader dark={dark} cartCount={placed ? 0 : count} active="cart" />

        {placed ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${cardClass}`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
              <CheckCircle2 className="h-9 w-9 text-green-500" />
            </div>
            <div>
              <h1 className={`text-xl font-semibold tracking-tight ${strongText}`}>
                Order placed!
              </h1>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Order #{placed.id.slice(0, 8)} · ${placed.totalPrice.toFixed(2)} ·{" "}
                {placed.status}
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <a
                href="/orders"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
              >
                View my orders <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="/menu"
                className={`inline-flex items-center justify-center rounded-xl border px-5 py-2 text-sm font-medium transition-colors ${
                  dark
                    ? "border-white/10 text-white/70 hover:bg-white/5"
                    : "border-black/10 text-black/60 hover:bg-black/5"
                }`}
              >
                Back to menu
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className={`text-2xl font-semibold tracking-tight ${strongText}`}>
                Checkout
              </h1>
              <p className={`text-sm ${mutedText}`}>
                Review your order before placing it
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center gap-3 py-24">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className={`text-sm ${mutedText}`}>Loading your order…</p>
              </div>
            ) : !user ? (
              <div
                className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${cardClass}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
                  <LogIn className="h-7 w-7 text-orange-500" />
                </div>
                <p className={`text-sm font-medium ${strongText}`}>
                  Sign in to check out
                </p>
                <a
                  href="/login"
                  className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
                >
                  Go to sign in
                </a>
              </div>
            ) : items.length === 0 ? (
              <div
                className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${cardClass}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
                  <ShoppingCart className="h-7 w-7 text-orange-500" />
                </div>
                <p className={`text-sm font-medium ${strongText}`}>
                  Your cart is empty
                </p>
                <a
                  href="/menu"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
                >
                  Browse the menu <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : (
              <div className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}>
                <ul className={`divide-y ${dark ? "divide-white/8" : "divide-black/8"}`}>
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-500/15 to-orange-400/5">
                        <UtensilsCrossed className="h-5 w-5 text-orange-500/70" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-medium ${strongText}`}>
                          {item.food.name}
                        </p>
                        <p className={`text-xs ${mutedText}`}>
                          ${item.unitPriceSnapshot.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold tabular-nums ${strongText}`}
                      >
                        ${(item.unitPriceSnapshot * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-4 flex items-center justify-between border-t pt-4 ${
                    dark ? "border-white/8" : "border-black/8"
                  }`}
                >
                  <span className={`text-sm font-medium ${strongText}`}>Total</span>
                  <span className={`text-xl font-semibold tabular-nums ${strongText}`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {error && (
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
                      dark
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePlace}
                  disabled={placing}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {placing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {placing ? "Placing order…" : "Place order"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

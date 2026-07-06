"use client";

import {
  AlertCircle,
  ArrowRight,
  Loader2,
  LogIn,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import AppHeader from "@/components/AppHeader";

export default function CartPage() {
  const theme = useTheme();
  const dark = theme !== "light";
  const { user, items, count, subtotal, loading, busy, error, setQuantity, remove, clear } =
    useCart();

  const cardClass = dark
    ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
    : "border-white/70 bg-white/60";
  const strongText = dark ? "text-white" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";

  const decrement = (id: string, quantity: number) => {
    if (quantity <= 1) {
      void remove(id);
    } else {
      void setQuantity(id, quantity - 1);
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
        className={`pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full blur-[80px] ${
          dark ? "bg-orange-400/[0.14]" : "bg-orange-300/12"
        }`}
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <AppHeader dark={dark} cartCount={count} active="cart" />

        <div className="mb-6">
          <h1 className={`text-2xl font-semibold tracking-tight ${strongText}`}>
            Your Cart
          </h1>
          <p className={`text-sm ${mutedText}`}>Review your items before checkout</p>
        </div>

        {error && (
          <div
            className={`mb-5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
              dark
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className={`text-sm ${mutedText}`}>Loading your cart…</p>
          </div>
        ) : !user ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${cardClass}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <LogIn className="h-7 w-7 text-orange-500" />
            </div>
            <p className={`text-sm font-medium ${strongText}`}>
              Sign in to use your cart
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
            <p className={`text-sm font-medium ${strongText}`}>Your cart is empty</p>
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
                <li key={item.id} className="flex items-center gap-3 py-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-500/15 to-orange-400/5">
                    <UtensilsCrossed className="h-5 w-5 text-orange-500/70" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${strongText}`}>
                      {item.food.name}
                    </p>
                    <p className={`text-xs ${mutedText}`}>
                      ${item.unitPriceSnapshot.toFixed(2)} each
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1 rounded-xl border p-0.5 ${
                      dark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => decrement(item.id, item.quantity)}
                      disabled={busy}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                        dark ? "hover:bg-white/10 text-white/70" : "hover:bg-black/5 text-black/60"
                      }`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className={`w-6 text-center text-sm font-medium tabular-nums ${strongText}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      disabled={busy}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                        dark ? "hover:bg-white/10 text-white/70" : "hover:bg-black/5 text-black/60"
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p
                    className={`w-16 text-right text-sm font-semibold tabular-nums ${strongText}`}
                  >
                    ${(item.unitPriceSnapshot * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => remove(item.id)}
                    disabled={busy}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                      dark
                        ? "text-white/40 hover:bg-red-500/10 hover:text-red-400"
                        : "text-black/40 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div
              className={`mt-4 flex items-center justify-between border-t pt-4 ${
                dark ? "border-white/8" : "border-black/8"
              }`}
            >
              <span className={`text-sm ${mutedText}`}>Subtotal</span>
              <span className={`text-xl font-semibold tabular-nums ${strongText}`}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                disabled
                title="Checkout is coming in the next update"
                className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 py-2.5 text-sm font-semibold text-white opacity-60"
              >
                Proceed to checkout <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => clear()}
                disabled={busy}
                className={`inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${
                  dark
                    ? "border-white/10 text-white/60 hover:bg-white/5"
                    : "border-black/10 text-black/55 hover:bg-black/5"
                }`}
              >
                Clear cart
              </button>
            </div>

            <p className={`mt-2 text-center text-[0.7rem] ${mutedText}`}>
              Checkout is coming in the next update.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

import {
  AlertCircle,
  ArrowRight,
  Loader2,
  LogIn,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const SERVICE_FEE = 2.5;
const STEPS = ["Review", "Options", "Delivery"];

export default function CartPage() {
  const { user, items, subtotal, loading, busy, error, setQuantity, remove, clear } =
    useCart();

  const decrement = (id: string, quantity: number) => {
    if (quantity <= 1) void remove(id);
    else void setQuantity(id, quantity - 1);
  };

  const hasItems = user && items.length > 0;
  const total = subtotal + (hasItems ? SERVICE_FEE : 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
        {/* ---------- Stepper ---------- */}
        <div className="flex items-start justify-center">
          {STEPS.map((s, i) => {
            const active = i === 0;
            return (
              <div key={s} className="flex items-start">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold ${
                      active ? "bg-[#d97a3a] text-white shadow-md" : "bg-[#e2e2e2] text-[#8a8a8a]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-2 text-[14px] font-semibold tracking-[0.14px] ${
                      active ? "text-[#d97a3a]" : "text-[#8a8a8a]"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 mt-5 h-0.5 w-16 sm:w-28 ${i === 0 ? "bg-[#d97a3a]" : "bg-[#e2e2e2]"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ---------- Heading ---------- */}
        <div className="mt-10">
          <h1 className="text-[26px] font-bold text-[#1a1c1c] lg:text-[32px]">
            Review Your Selection
          </h1>
          <p className="mt-2 text-[16px] text-[#5f5e5e]">
            Almost there! Take a moment to check your delicious picks before we
            finalize the options.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#d97a3a]" />
            <p className="text-sm text-[#5f5e5e]">Loading your cart…</p>
          </div>
        ) : !user ? (
          <EmptyState
            icon={<LogIn className="h-7 w-7 text-[#d97a3a]" />}
            title="Sign in to use your cart"
            href="/login"
            cta="Go to sign in"
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-7 w-7 text-[#d97a3a]" />}
            title="Your cart is empty"
            href="/menu"
            cta="Browse the menu"
          />
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
            {/* Items */}
            <div className="rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)] lg:col-span-2">
              <ul className="divide-y divide-[#eef0f3]">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-5">
                    <img
                      src="/home/menu-plate.jpg"
                      alt={item.food.name}
                      className="h-[72px] w-[88px] shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-bold text-[#181818]">{item.food.name}</p>
                      <p className="mt-0.5 text-[13px] text-[#8a8a8a]">
                        ${item.unitPriceSnapshot.toFixed(2)} each
                      </p>
                      <p className="mt-1 text-[16px] font-semibold text-[#d97a3a]">
                        ${(item.unitPriceSnapshot * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => remove(item.id)}
                        disabled={busy}
                        className="text-[#d97a3a] transition-colors hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <div className="flex items-center gap-1 rounded-full border border-[#e2e2e2] p-0.5">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => decrement(item.id, item.quantity)}
                          disabled={busy}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#636262] transition-colors hover:bg-black/5 disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums text-[#181818]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          disabled={busy}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#636262] transition-colors hover:bg-black/5 disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => clear()}
                disabled={busy}
                className="mt-4 text-[13px] font-medium text-[#8a8a8a] transition-colors hover:text-red-500 disabled:opacity-40"
              >
                Clear cart
              </button>
            </div>

            {/* Summary + promo */}
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
                <h2 className="text-[24px] font-semibold text-[#1a1c1c]">Order Summary</h2>
                <div className="mt-4 space-y-3 text-[16px] text-[#5f5e5e]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>${SERVICE_FEE.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#eadfd7] pt-4">
                  <span className="text-[22px] font-bold text-[#1a1c1c]">Total</span>
                  <span className="text-[22px] font-bold text-[#1a1c1c]">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <a
                  href="/checkout"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d97a3a] py-3.5 font-[family-name:var(--font-inter)] text-[16px] font-bold text-white transition-colors hover:bg-[#cc6d2f]"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
                <label className="text-[12px] font-medium text-[#8a8a8a]">Promo Code</label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="h-11 flex-1 rounded-full border border-[#e2e2e2] bg-white px-4 text-[14px] outline-none placeholder:text-[#98a2b3] focus:border-[#d97a3a]"
                  />
                  <button
                    type="button"
                    className="rounded-full border border-[#d97a3a] px-5 py-2.5 text-[14px] font-semibold text-[#d97a3a] transition-colors hover:bg-[#d97a3a] hover:text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-[#eef0f3] bg-white py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8ddc9]">
        {icon}
      </div>
      <p className="text-[15px] font-medium text-[#242424]">{title}</p>
      <a
        href={href}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#d97a3a] px-6 py-2.5 font-[family-name:var(--font-inter)] text-sm font-bold text-white transition-colors hover:bg-[#cc6d2f]"
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

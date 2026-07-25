"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Bike,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  LogIn,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { placeOrder } from "@/lib/checkout";
import type { Order } from "@/lib/orders";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const STEPS = ["Review", "Options", "Delivery"];

export default function CheckoutPage() {
  const { user, items, subtotal, loading } = useCart();

  const [fulfillment, setFulfillment] = useState<"takeaway" | "delivery">("takeaway");
  const [payment, setPayment] = useState<"card" | "cash">("card");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);

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
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1000px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
        {placed ? (
          <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-[#eef0f3] bg-white py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
              <CheckCircle2 className="h-9 w-9 text-green-500" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#1a1c1c]">Order placed!</h1>
              <p className="mt-1 text-sm text-[#5f5e5e]">
                Order #{placed.id.slice(0, 8)} · ${placed.totalPrice.toFixed(2)} ·{" "}
                {placed.status}
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <a
                href="/orders"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#d97a3a] px-6 py-2.5 font-[family-name:var(--font-inter)] text-sm font-bold text-white transition-colors hover:bg-[#cc6d2f]"
              >
                View my orders <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="/menu"
                className="inline-flex items-center justify-center rounded-full border border-[#d0d5dd] px-6 py-2.5 text-sm font-medium text-[#242424] transition-colors hover:bg-black/5"
              >
                Back to menu
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Stepper */}
            <div className="flex items-start justify-center">
              {STEPS.map((s, i) => {
                const active = i <= 1;
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

            <div className="mt-10 text-center">
              <h1 className="text-[26px] font-bold text-[#1a1c1c] lg:text-[32px]">
                How would you like to receive your order?
              </h1>
              <p className="mx-auto mt-2 max-w-[560px] text-[16px] text-[#5f5e5e]">
                Choose your preferred fulfillment method and payment option to
                proceed with your FoodSpot order.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center gap-3 py-24">
                <Loader2 className="h-8 w-8 animate-spin text-[#d97a3a]" />
                <p className="text-sm text-[#5f5e5e]">Loading your order…</p>
              </div>
            ) : !user ? (
              <EmptyState
                icon={<LogIn className="h-7 w-7 text-[#d97a3a]" />}
                title="Sign in to check out"
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
              <>
                {/* Fulfillment options */}
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <OptionCard
                    selected={fulfillment === "takeaway"}
                    onClick={() => setFulfillment("takeaway")}
                    icon={<Store className="h-5 w-5 text-[#d97a3a]" />}
                    title="Takeaway"
                    desc="Pick up your order directly from the restaurant. No delivery fees applied."
                    footer={
                      <>
                        <Clock className="h-4 w-4" /> Ready in 15–20 mins
                      </>
                    }
                  />
                  <OptionCard
                    selected={fulfillment === "delivery"}
                    onClick={() => setFulfillment("delivery")}
                    icon={<Bike className="h-5 w-5 text-[#d97a3a]" />}
                    title="Delivery"
                    desc="Have your favorite food delivered straight to your doorstep by our couriers."
                    footer={
                      <>
                        <Bike className="h-4 w-4" /> Arrives in 30–45 mins
                      </>
                    }
                  />
                </div>

                {/* Payment method */}
                <div className="mt-6 rounded-xl bg-[#f1efee] p-6">
                  <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#1a1c1c]">
                    <CreditCard className="h-5 w-5" /> Payment Method
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <PayOption
                      selected={payment === "card"}
                      onClick={() => setPayment("card")}
                      icon={<CreditCard className="h-4 w-4 text-[#d97a3a]" />}
                      label="Credit Card"
                    />
                    <PayOption
                      selected={payment === "cash"}
                      onClick={() => setPayment("cash")}
                      icon={<Banknote className="h-4 w-4 text-[#d97a3a]" />}
                      label="Cash"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Total + actions */}
                <div className="mt-6 flex flex-col gap-4 border-t border-[#eadfd7] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/home/menu-plate.jpg"
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-[12px] uppercase tracking-wide text-[#8a8a8a]">
                        Your order total
                      </p>
                      <p className="text-[22px] font-bold text-[#d97a3a]">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href="/cart"
                      className="inline-flex items-center justify-center rounded-lg border border-[#d0d5dd] px-6 py-3 text-[15px] font-medium text-[#242424] transition-colors hover:bg-black/5"
                    >
                      Back to Review
                    </a>
                    <button
                      type="button"
                      onClick={handlePlace}
                      disabled={placing}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d97a3a] px-8 py-3 font-[family-name:var(--font-inter)] text-[15px] font-bold text-white transition-colors hover:bg-[#cc6d2f] disabled:opacity-60"
                    >
                      {placing && <Loader2 className="h-4 w-4 animate-spin" />}
                      {placing ? "Placing…" : "Place Order"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  icon,
  title,
  desc,
  footer,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  footer: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-6 text-left transition-colors ${
        selected ? "border-[#d97a3a] bg-[#fae9dc]" : "border-[#eef0f3] bg-white hover:border-[#dcc1b4]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8ddc9]">
          {icon}
        </div>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#d97a3a]" : "border-[#c9c9c9]"
          }`}
        >
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#d97a3a]" />}
        </span>
      </div>
      <h3 className="mt-4 text-[20px] font-bold text-[#1a1c1c]">{title}</h3>
      <p className="mt-1 text-[15px] leading-6 text-[#5f5e5e]">{desc}</p>
      <p className="mt-4 flex items-center gap-2 border-t border-[#eadfd7] pt-3 text-[13px] font-medium text-[#d97a3a]">
        {footer}
      </p>
    </button>
  );
}

function PayOption({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-[14px] font-medium transition-colors ${
        selected ? "border-[#d97a3a] text-[#1a1c1c]" : "border-[#e2e2e2] text-[#636262] hover:border-[#dcc1b4]"
      }`}
    >
      {icon}
      {label}
      <span
        className={`ml-1 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
          selected ? "border-[#d97a3a]" : "border-[#c9c9c9]"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-[#d97a3a]" />}
      </span>
    </button>
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

"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Building2, Info, MapPin } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const STEPS = ["Review", "Options", "Delivery"];
const DELIVERY_FEE = 2.99;
const SERVICE_FEE = 1.5;

export default function DeliveryPage() {
  const { items, subtotal } = useCart();
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-jakarta)] text-[#242424]">
      <SiteHeader active="delivery" />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
        {/* ---------- Progress stepper ---------- */}
        <div className="flex items-start justify-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-start">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d97a3a] text-[16px] font-bold text-white shadow-md">
                  {i + 1}
                </div>
                <span className="mt-2 text-[14px] font-semibold tracking-[0.14px] text-[#d97a3a]">
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 mt-5 h-0.5 w-16 bg-[#d97a3a] sm:w-28" />
              )}
            </div>
          ))}
        </div>

        {/* ---------- Heading ---------- */}
        <div className="mt-10 text-center">
          <h1 className="text-[26px] font-bold tracking-[-0.32px] text-[#1a1c1c] lg:text-[32px]">
            Where should we send your order?
          </h1>
          <p className="mx-auto mt-2 max-w-[640px] text-[16px] leading-6 text-[#5f5e5e]">
            Please provide precise delivery details to ensure your food arrives
            fresh and on time.
          </p>
        </div>

        {/* ---------- Content grid ---------- */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
          {/* Left: form + map */}
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-6 rounded-xl border border-[#d97a3a] bg-white p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Street Name & Number"
                  placeholder="e.g. 123 Gourmet Way"
                  icon={<MapPin className="h-4 w-4 text-[#d97a3a]" />}
                />
                <Field
                  label="Apartment/Suite (Optional)"
                  placeholder="e.g. Apt 4B"
                  icon={<Building2 className="h-4 w-4 text-[#d97a3a]" />}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[14px] font-semibold tracking-[0.14px] text-[#d97a3a]">
                  Delivery Note for the Courier
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell the driver how to find you (e.g. 'Ring bell for Smith', 'Leave at front gate', 'Gate code 1234')"
                  className="w-full rounded-lg border border-[#d97a3a] bg-[#f3f3f3] px-4 py-3 text-[16px] leading-6 text-[#242424] outline-none placeholder:text-[#6b7280] focus:ring-[3px] focus:ring-[#d97a3a]/20"
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-[rgba(226,223,222,0.3)] p-3">
                <Info className="h-5 w-5 shrink-0 text-[#d97a3a]" />
                <p className="text-[12px] leading-4 text-[#636262]">
                  Your courier will receive these notes once they pick up your
                  order. Be as specific as possible for faster delivery.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="relative h-64 overflow-hidden rounded-xl border border-[#e1bfb5]">
              <img
                src="/home/delivery-map.jpg"
                alt="Delivery map"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[rgba(169,49,0,0.05)]" />
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#e1bfb5] bg-white/80 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#a93100]" />
                <span className="text-[14px] font-semibold tracking-[0.14px] text-[#1a1c1c]">
                  Live map tracking enabled
                </span>
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <aside className="space-y-6 rounded-xl border border-[#d97a3a] bg-white p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <h2 className="text-[24px] font-semibold leading-8 text-[#1a1c1c]">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[16px] text-[#5f5e5e]">
                <span>Items ({itemCount})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[16px] text-[#5f5e5e]">
                <span>Delivery Fee</span>
                <span>${DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[16px] text-[#5f5e5e]">
                <span>Service Fee</span>
                <span>${SERVICE_FEE.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#d97a3a] pt-3">
                <span className="text-[24px] font-semibold text-[#1a1c1c]">Total</span>
                <span className="text-[24px] font-semibold text-[#d97a3a]">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d97a3a] py-4 text-[16px] font-bold text-white transition-colors hover:bg-[#cc6d2f]"
              >
                Confirm
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-[12px] font-medium leading-4 text-[#5c5c5c]">
                By placing your order, you agree to FoodSpot&apos;s Terms of
                Service and Privacy Policy.
              </p>
            </div>

            <div className="space-y-3 border-t border-[#d97a3a] pt-6">
              <p className="text-[14px] font-semibold uppercase tracking-[0.7px] text-[#d97a3a]">
                Your Selection
              </p>
              {items.length === 0 ? (
                <p className="text-[13px] text-[#8a8a8a]">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src="/home/menu-plate.jpg"
                      alt={item.food.name}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold tracking-[0.14px] text-[#1a1c1c]">
                        {item.food.name}
                      </p>
                      <p className="text-[12px] font-medium text-[#5f5e5e]">x{item.quantity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[14px] font-semibold tracking-[0.14px] text-[#d97a3a]">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className="h-12 w-full rounded-lg border border-[#d97a3a] bg-[#f3f3f3] pl-10 pr-4 text-[16px] text-[#242424] outline-none placeholder:text-[#6b7280] focus:ring-[3px] focus:ring-[#d97a3a]/20"
        />
      </div>
    </div>
  );
}

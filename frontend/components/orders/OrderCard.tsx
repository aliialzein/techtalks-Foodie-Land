"use client";

import { Loader2, Store, Utensils } from "lucide-react";
import { isCancellable, type Order } from "@/lib/orders";
import StatusBadge from "./StatusBadge";
import OrderStatusTracker from "./OrderStatusTracker";

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrderCard({
  order,
  dark,
  onCancel,
  cancelling,
}: {
  order: Order;
  dark: boolean;
  onCancel: (id: string) => void;
  cancelling: boolean;
}) {
  const cardClass = dark
    ? "bg-[rgba(20,10,5,0.55)] border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
    : "bg-white/60 border-white/70 shadow-[0_8px_40px_rgba(180,80,0,0.08)]";

  const borderCol = dark ? "border-white/8" : "border-black/8";
  const divideCol = dark ? "divide-white/8" : "divide-black/8";
  const mutedText = dark ? "text-white/40" : "text-black/45";
  const strongText = dark ? "text-white" : "text-gray-900";

  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-600 to-orange-400 shadow-[0_4px_12px_rgba(234,88,12,0.35)]">
            <Store className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className={`text-sm font-semibold tracking-tight ${strongText}`}>
              {order.restaurant.name}
            </p>
            <p className={`text-[0.7rem] ${mutedText}`}>
              #{order.id.slice(0, 8)} · {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} dark={dark} />
      </div>

      <div className="my-5">
        <OrderStatusTracker status={order.status} dark={dark} />
      </div>

      <ul className={`divide-y ${divideCol} border-y ${borderCol}`}>
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <span className={`flex items-center gap-2 text-sm ${strongText}`}>
              <Utensils className={`h-3.5 w-3.5 ${mutedText}`} />
              {item.nameSnapshot}
              <span className={`text-xs ${mutedText}`}>×{item.quantity}</span>
            </span>
            <span className={`text-sm tabular-nums ${mutedText}`}>
              {formatPrice(item.priceSnapshot * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className={`text-[0.65rem] uppercase tracking-widest ${mutedText}`}>
            Total
          </p>
          <p className={`text-lg font-semibold tabular-nums ${strongText}`}>
            {formatPrice(order.totalPrice)}
          </p>
        </div>

        {isCancellable(order.status) && (
          <button
            type="button"
            onClick={() => onCancel(order.id)}
            disabled={cancelling}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              dark
                ? "border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            {cancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {cancelling ? "Cancelling…" : "Cancel order"}
          </button>
        )}
      </div>
    </div>
  );
}

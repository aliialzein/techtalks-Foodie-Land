import { Check, XCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/orders";
import { STATUS_META } from "./StatusBadge";

// The happy-path lifecycle, in order. CANCELLED is a terminal off-ramp shown
// separately rather than as a step.
const PIPELINE: OrderStatus[] = ["PENDING", "PREPARING", "READY", "DELIVERED"];

export default function OrderStatusTracker({
  status,
  dark,
}: {
  status: OrderStatus;
  dark: boolean;
}) {
  if (status === "CANCELLED") {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium ${
          dark
            ? "bg-red-500/10 border-red-500/25 text-red-300"
            : "bg-red-50 border-red-200 text-red-600"
        }`}
      >
        <XCircle className="w-4 h-4" />
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = PIPELINE.indexOf(status);

  return (
    <div className="flex items-start">
      {PIPELINE.map((step, i) => {
        const reached = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const meta = STATUS_META[step];
        const { Icon } = meta;

        return (
          <div
            key={step}
            className="relative flex flex-1 flex-col items-center"
          >
            {i > 0 && (
              <div
                className={`absolute top-3.5 right-1/2 h-0.5 w-full ${
                  reached
                    ? "bg-orange-500"
                    : dark
                      ? "bg-white/10"
                      : "bg-black/10"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                reached
                  ? "bg-linear-to-br from-orange-600 to-orange-400 text-white shadow-[0_2px_10px_rgba(234,88,12,0.4)]"
                  : dark
                    ? "bg-white/5 text-white/30 border border-white/10"
                    : "bg-black/5 text-black/30 border border-black/10"
              } ${isCurrent ? "ring-[3px] ring-orange-500/25" : ""}`}
            >
              {reached ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
            </div>

            <span
              className={`mt-1.5 text-[0.6rem] font-medium uppercase tracking-wide ${
                reached
                  ? dark
                    ? "text-white/70"
                    : "text-black/60"
                  : dark
                    ? "text-white/30"
                    : "text-black/30"
              }`}
            >
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

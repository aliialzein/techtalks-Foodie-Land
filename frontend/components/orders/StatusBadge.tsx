import { Bell, CheckCircle2, Clock, CookingPot, XCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/orders";

// All lucide icons share the same component type, so `typeof Clock` accurately
// types any of them without depending on a named export.
type IconType = typeof Clock;

export interface StatusMeta {
  label: string;
  Icon: IconType;
  badgeLight: string;
  badgeDark: string;
}

// Single source of truth for how each order status looks across the feature.
export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  PENDING: {
    label: "Pending",
    Icon: Clock,
    badgeLight: "bg-amber-100 text-amber-700 border-amber-200",
    badgeDark: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  },
  PREPARING: {
    label: "Preparing",
    Icon: CookingPot,
    badgeLight: "bg-blue-100 text-blue-700 border-blue-200",
    badgeDark: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  },
  READY: {
    label: "Ready",
    Icon: Bell,
    badgeLight: "bg-violet-100 text-violet-700 border-violet-200",
    badgeDark: "bg-violet-500/10 text-violet-300 border-violet-500/25",
  },
  DELIVERED: {
    label: "Delivered",
    Icon: CheckCircle2,
    badgeLight: "bg-green-100 text-green-700 border-green-200",
    badgeDark: "bg-green-500/10 text-green-300 border-green-500/25",
  },
  CANCELLED: {
    label: "Cancelled",
    Icon: XCircle,
    badgeLight: "bg-red-100 text-red-700 border-red-200",
    badgeDark: "bg-red-500/10 text-red-300 border-red-500/25",
  },
};

export default function StatusBadge({
  status,
  dark,
}: {
  status: OrderStatus;
  dark: boolean;
}) {
  const meta = STATUS_META[status];
  const { Icon } = meta;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        dark ? meta.badgeDark : meta.badgeLight
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {meta.label}
    </span>
  );
}

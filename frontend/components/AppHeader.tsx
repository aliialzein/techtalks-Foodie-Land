import { ChefHat, ShoppingCart } from "lucide-react";

type NavKey = "menu" | "orders" | "cart";

export default function AppHeader({
  dark,
  cartCount,
  active,
}: {
  dark: boolean;
  cartCount: number;
  active?: NavKey;
}) {
  const linkClass = (isActive: boolean) =>
    isActive
      ? "text-orange-500"
      : dark
        ? "text-white/55 hover:text-white"
        : "text-black/55 hover:text-black";

  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <a href="/menu" className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-600 to-orange-400 shadow-[0_4px_12px_rgba(234,88,12,0.4)]">
          <ChefHat className="h-5 w-5 text-white" />
        </div>
        <span
          className={`text-[1.05rem] font-semibold tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          Foodie<span className="text-orange-600">Land</span>
        </span>
      </a>

      <nav className="flex items-center gap-3 text-sm font-medium sm:gap-5">
        <a href="/menu" className={`transition-colors ${linkClass(active === "menu")}`}>
          Menu
        </a>
        <a
          href="/orders"
          className={`transition-colors ${linkClass(active === "orders")}`}
        >
          Orders
        </a>
        <a
          href="/cart"
          aria-label="Cart"
          className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
            active === "cart"
              ? "border-orange-500/40 bg-orange-500/10 text-orange-500"
              : dark
                ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                : "border-black/10 bg-white/60 text-black/60 hover:bg-white/90"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-linear-to-r from-orange-600 to-orange-400 px-1 text-[0.6rem] font-bold text-white">
              {cartCount}
            </span>
          )}
        </a>
      </nav>
    </header>
  );
}

/* eslint-disable @next/next/no-img-element */
import { User } from "lucide-react";

type PanelKey = "home" | "orders" | "menu";

const LINKS: { key: PanelKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/owner/dashboard" },
  { key: "orders", label: "Orders", href: "/owner/orders" },
  { key: "menu", label: "Menu", href: "/owner/menu" },
];

// Shared header for the restaurant-owner panel (light FoodSpot design).
export default function PanelHeader({ active }: { active?: PanelKey }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eef0f3] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-10">
          <a href="/owner/dashboard" className="shrink-0">
            <img src="/home/logo.png" alt="FoodSpot" className="h-8 w-auto" />
          </a>
          <nav className="flex items-center gap-8 font-[family-name:var(--font-inter)] text-[15px] font-medium">
            {LINKS.map((l) => (
              <a
                key={l.key}
                href={l.href}
                className={
                  active === l.key
                    ? "text-[#d97a3a] underline underline-offset-4"
                    : "text-[#242424] transition-colors hover:text-[#d97a3a]"
                }
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <a href="/owner" aria-label="Account" className="text-[#242424] transition-colors hover:text-[#d97a3a]">
          <User className="h-6 w-6" />
        </a>
      </div>
    </header>
  );
}

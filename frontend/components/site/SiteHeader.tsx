/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Globe, ShoppingCart, User } from "lucide-react";

type NavKey = "home" | "restaurants" | "delivery" | "support";

const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "restaurants", label: "Restaurants", href: "/restaurants" },
  { key: "delivery", label: "Delivery", href: "/delivery" },
  { key: "support", label: "Support", href: "/contact" },
];

// Shared FoodSpot app header (logged-in variant: globe / cart / account).
export default function SiteHeader({ active }: { active?: NavKey }) {
  return (
    <header className="sticky top-0 z-50 border-b-[1.5px] border-[#eef0f3] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-6 px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="shrink-0">
            <img src="/home/logo.png" alt="FoodSpot" className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 font-[family-name:var(--font-inter)] text-[15px] font-medium lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={
                  active === l.key
                    ? "text-[#d97a3a] underline underline-offset-4"
                    : "text-[#242424] transition-colors hover:text-[#d97a3a]"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-[#242424]">
          <Globe className="hidden h-5 w-5 text-black/70 sm:block" />
          <Link href="/cart" aria-label="Cart" className="transition-colors hover:text-[#d97a3a]">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link href="/login" aria-label="Account" className="transition-colors hover:text-[#d97a3a]">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "FoodSpot — Discover Great Food, All in One Place",
  description:
    "Discover local restaurants, compare menus, and enjoy fast, convenient ordering from your favorite places.",
};

const NAV = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "#about" },
  { label: "Resturants", href: "/menu" },
  { label: "Support", href: "#support" },
];

const FEATURES = [
  {
    icon: "/home/icon-restaurants.png",
    title: "30+ Restaurants",
    desc: "Find restaurants offering every cuisine you love.",
  },
  {
    icon: "/home/icon-delivery.png",
    title: "Fast Delivery",
    desc: "Order your favorite meals with quick and reliable delivery.",
  },
  {
    icon: "/home/icon-toprated.png",
    title: "Top Rated",
    desc: "Discover highly rated restaurants trusted by thousands of food lovers.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-50 border-b-[1.5px] border-[#eef0f3] bg-white">
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-6 px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-8 lg:gap-12">
            <a href="/" className="shrink-0">
              <img src="/home/logo.png" alt="FoodSpot" className="h-9 w-auto" />
            </a>
            <nav className="hidden items-center gap-8 font-[family-name:var(--font-inter)] text-[15px] font-medium lg:flex">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={
                    item.active
                      ? "text-[#d97a3a] underline underline-offset-4"
                      : "text-[#242424] transition-colors hover:text-[#d97a3a]"
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="/home/globe.svg"
              alt=""
              className="hidden h-6 w-6 sm:block"
            />
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm font-medium text-[#242424] transition-colors hover:bg-[#e6e6e6]"
            >
              Sign in
              <img src="/home/arrow-right.svg" alt="" className="h-4 w-4" />
            </a>
            <a
              href="/register"
              className="inline-flex items-center rounded-full bg-[#d97a3a] px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f]"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-6 py-12 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-20">
        <div className="max-w-[576px]">
          <h1 className="text-[36px] font-bold leading-[1.05] text-black sm:text-[44px] lg:text-[48px] lg:leading-[50px]">
            Discover Great Food, All in One Place
          </h1>
          <p className="mt-6 text-[18px] leading-[25px] text-[#3c3c43] lg:text-[19px]">
            Discover local restaurants, compare menus, and enjoy fast,
            convenient ordering from your favorite places.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <img
                src="/home/search.svg"
                alt=""
                className="pointer-events-none absolute left-6 top-1/2 h-[18px] w-[18px] -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or locations..."
                className="h-14 w-full rounded-full border border-[#d97a3a] bg-[#fbf9f9] pl-14 pr-6 text-[16px] text-[#242424] outline-none placeholder:text-[#6b7280] focus:ring-[3px] focus:ring-[#d97a3a]/20"
              />
            </div>
            <a
              href="/menu"
              className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-[#d97a3a] px-7 font-[family-name:var(--font-inter)] text-sm font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f]"
            >
              Explore Resturants
            </a>
          </div>
        </div>

        {/* Food photo card */}
        <div className="rounded-xl bg-white p-6 shadow-[0_10px_40px_rgba(17,17,17,0.06)]">
          <img
            src="/home/food.jpg"
            alt="A spread of carefully crafted dishes"
            className="h-[250px] w-full rounded-xl object-cover"
          />
          <h2 className="mt-6 text-[25px] font-bold text-black">
            Discover Great Flavors
          </h2>
          <p className="mt-1 text-[18px] leading-snug text-[#3c3c43] lg:text-[19px]">
            Enjoy a unique dining experience with carefully crafted dishes and
            exceptional flavors.
          </p>
          <div className="mt-2 text-right text-[22px] text-[#d97a3a]">
            <span className="text-[#d97a3a]/20">←</span> <span>→</span>
          </div>
        </div>
      </section>

      {/* ---------- Feature cards ---------- */}
      <section className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 sm:px-8 md:grid-cols-3 lg:px-12">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-6 rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.04)]"
          >
            <img src={f.icon} alt="" className="h-20 w-20 shrink-0 object-contain" />
            <div>
              <h3 className="text-[18px] font-bold text-black lg:text-[20px]">
                {f.title}
              </h3>
              <p className="mt-1 text-[14px] leading-snug text-[#3c3c43]">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- What Makes Special ---------- */}
      <section className="mx-auto w-full max-w-[1280px] px-6 py-16 text-center sm:px-8 lg:px-12">
        <h2 className="text-[28px] font-bold text-black lg:text-[32px]">
          What Makes Food Spot Special?
        </h2>
        <p className="mt-3 text-[18px] text-[#3c3c43] lg:text-[20px]">
          Find restaurants, compare menus, and order effortlessly.
        </p>
      </section>

      {/* ---------- Food Spot Map ---------- */}
      <section className="mx-auto w-full max-w-[1280px] px-6 pb-16 sm:px-8 lg:px-12">
        <h2 className="text-[28px] font-bold tracking-[-0.32px] text-[#1b1c1c] lg:text-[32px]">
          Food Spot Map
        </h2>
        <p className="mb-4 text-[14px] tracking-[0.28px] text-[#5f5e5e]">
          Find your favorite restaurants on our adventure map.
        </p>
        <div className="overflow-hidden rounded-xl border border-[#dcc1b4] bg-[#f5f3f3]">
          <img
            src="/home/map.jpg"
            alt="FoodSpot adventure map with restaurant locations"
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <SiteFooter />
    </div>
  );
}

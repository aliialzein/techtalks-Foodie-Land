/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Restaurants — FoodSpot",
  description:
    "Explore curated culinary destinations across Lebanon. From local gems to premium dining experiences.",
};

const CATEGORIES = ["All", "Pizza", "Burgers", "Cafe", "Desserts"];

const RESTAURANTS = [
  { name: "Em Sherif", rating: "4.8", img: "/home/rest-1.jpg" },
  { name: "Kababji", rating: "4.1", img: "/home/rest-2.png" },
  { name: "al jawad", rating: "4.8", img: "/home/rest-3.jpg" },
  { name: "Em Sherif", rating: "4.8", img: "/home/rest-1.jpg" },
  { name: "Em Sherif", rating: "4.8", img: "/home/rest-1.jpg" },
  { name: "Kababji", rating: "4.1", img: "/home/rest-2.png" },
  { name: "al jawad", rating: "4.8", img: "/home/rest-3.jpg" },
  { name: "Em Sherif", rating: "4.8", img: "/home/rest-1.jpg" },
];

export default function RestaurantsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <SiteHeader active="restaurants" />

      {/* ---------- Hero + search ---------- */}
      <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-6 pt-14 text-center sm:px-8 lg:px-12">
        <div>
          <h1 className="text-[36px] font-bold tracking-[-0.96px] text-[#1b1c1c] lg:text-[48px]">
            Find Your Flavor
          </h1>
          <p className="mx-auto mt-4 max-w-[672px] text-[18px] leading-7 text-[#5f5e5e]">
            Explore curated culinary destinations across Lebanon. From local
            gems to premium dining experiences.
          </p>
        </div>

        <div className="relative w-full max-w-[576px]">
          <img
            src="/home/search.svg"
            alt=""
            className="pointer-events-none absolute left-6 top-1/2 h-[18px] w-[18px] -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines, or locations..."
            className="h-14 w-full rounded-full border border-[#dcc1b4] bg-[#fbf9f9] pl-14 pr-6 text-[16px] text-[#242424] outline-none placeholder:text-[#6b7280] focus:ring-[3px] focus:ring-[#d97a3a]/20"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              type="button"
              className={
                i === 0
                  ? "rounded-full bg-[#e87c3e] px-8 py-2.5 text-[16px] text-white"
                  : "rounded-full border border-[#dcc1b4] bg-[#f5f3f3] px-8 py-2.5 text-[16px] text-[#636262] transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a]"
              }
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Restaurants grid ---------- */}
      <section className="mx-auto w-full max-w-[1280px] px-6 py-12 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[#181818]">
              All Restaurants
            </h2>
            <p className="text-[15px] text-[#666]">100+ resturants available</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Filter"
              className="rounded-lg border border-[#d97a3a] p-2.5 text-[#d97a3a] transition-colors hover:bg-[#d97a3a]/10"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Sort"
              className="rounded-lg border border-[#d97a3a] p-2.5 text-[#d97a3a] transition-colors hover:bg-[#d97a3a]/10"
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RESTAURANTS.map((r, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-white shadow-[0_6px_24px_rgba(17,17,17,0.05)]"
            >
              <img src={r.img} alt={r.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="text-[18px] font-bold text-[#181818]">{r.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[15px] text-[#666]">
                  <Star className="h-4 w-4 fill-[#f5a623] text-[#f5a623]" />
                  {r.rating}
                </p>
                <a
                  href="/menu"
                  className="mt-4 block rounded-full bg-[#d97a3a] py-2.5 text-center font-[family-name:var(--font-inter)] text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f]"
                >
                  View Menu
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Pagination ---------- */}
        <div className="mt-10 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-[#dedede] text-[#aeaeae]">
            <ChevronLeft className="h-4 w-4" />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d97a3a] text-sm font-semibold text-white">
            1
          </span>
          {[2, 3, 4].map((n) => (
            <a
              key={n}
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dedede] text-sm text-black transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a]"
            >
              {n}
            </a>
          ))}
          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dedede] text-black transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a]"
          >
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

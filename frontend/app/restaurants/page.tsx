"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Search, Store } from "lucide-react";
import { getRestaurants, type Restaurant } from "@/lib/restaurants";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const all = await getRestaurants();
      // Only show restaurants approved for public listing.
      setRestaurants(all.filter((r) => (r.status ?? "").toUpperCase() === "APPROVED"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q),
    );
  }, [restaurants, query]);

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
          <Search className="pointer-events-none absolute left-6 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants..."
            className="h-14 w-full rounded-full border border-[#dcc1b4] bg-[#fbf9f9] pl-14 pr-6 text-[16px] text-[#242424] outline-none placeholder:text-[#6b7280] focus:ring-[3px] focus:ring-[#d97a3a]/20"
          />
        </div>
      </section>

      {/* ---------- Restaurants grid ---------- */}
      <section className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#181818]">All Restaurants</h2>
          <p className="text-[15px] text-[#666]">
            {loading ? "Loading…" : `${restaurants.length} restaurant${restaurants.length === 1 ? "" : "s"} available`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#d97a3a]" />
          </div>
        ) : error ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-[#eef0f3] bg-white py-16 text-center">
            <AlertCircle className="h-9 w-9 text-red-500" />
            <p className="text-sm text-[#5f5e5e]">{error}</p>
            <button
              type="button"
              onClick={load}
              className="rounded-full bg-[#d97a3a] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#cc6d2f]"
            >
              Try again
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-[#eef0f3] bg-white py-20 text-center">
            <Store className="h-9 w-9 text-[#d97a3a]" />
            <p className="text-sm font-medium text-[#242424]">
              {query ? "No restaurants match your search." : "No restaurants available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((r) => (
              <div
                key={r.id}
                className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_6px_24px_rgba(17,17,17,0.05)]"
              >
                <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-[#fbe7d8] to-[#f8ddc9]">
                  <Store className="h-10 w-10 text-[#d97a3a]" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[18px] font-bold text-[#181818]">{r.name}</p>
                  <p className="mt-1 line-clamp-2 text-[13px] text-[#8a8a8a]">
                    {r.description || "No description provided."}
                  </p>
                  <a
                    href={`/menu?restaurantId=${r.id}`}
                    className="mt-4 block rounded-full bg-[#d97a3a] py-2.5 text-center font-[family-name:var(--font-inter)] text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f]"
                  >
                    View Menu
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

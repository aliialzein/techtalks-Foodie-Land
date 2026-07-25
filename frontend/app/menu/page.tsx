"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, Search, UtensilsCrossed } from "lucide-react";
import { getFoods, type Food } from "@/lib/foods";
import { useCurrentUser } from "@/lib/auth";
import { useCart } from "@/hooks/useCart";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const CATEGORIES = ["All", "Mains", "Starters", "Grill", "Special"];

export default function MenuPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const { add } = useCart();

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setFoods(await getFoods());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the menu.");
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
    if (!q) return foods;
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.restaurant.name.toLowerCase().includes(q),
    );
  }, [foods, query]);

  const handleAdd = async (foodId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setAddingId(foodId);
    await add(foodId, 1);
    setAddingId(null);
    setAddedId(foodId);
    window.setTimeout(() => setAddedId((id) => (id === foodId ? null : id)), 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <SiteHeader active="restaurants" />

      {/* ---------- Hero + search ---------- */}
      <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-6 pt-14 text-center sm:px-8 lg:px-12">
        <div>
          <h1 className="text-[36px] font-bold tracking-[-0.96px] text-[#1b1c1c] lg:text-[44px]">
            Explore the Menu
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] text-[18px] leading-7 text-[#5f5e5e]">
            Browse dishes from every restaurant and add your favourites to the
            cart.
          </p>
        </div>

        <div className="relative w-full max-w-[576px]">
          <Search className="pointer-events-none absolute left-6 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for plates"
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

      {/* ---------- Plates ---------- */}
      <section className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 sm:px-8 lg:px-12">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#d97a3a]" />
            <p className="text-sm text-[#5f5e5e]">Loading the menu…</p>
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
            <UtensilsCrossed className="h-9 w-9 text-[#d97a3a]" />
            <p className="text-sm font-medium text-[#242424]">
              {query ? "No plates match your search." : "No dishes available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((food) => {
              const isAdding = addingId === food.id;
              const justAdded = addedId === food.id;
              return (
                <div
                  key={food.id}
                  className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)]"
                >
                  <img
                    src="/home/menu-plate.jpg"
                    alt={food.name}
                    className="h-[188px] w-full rounded-[18px] object-cover"
                  />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[18px] font-bold text-black">{food.name}</p>
                        <p className="mt-0.5 text-[13px] text-[#8a8a8a]">
                          {food.restaurant.name}
                        </p>
                      </div>
                      <p className="shrink-0 text-[16px] font-semibold text-[#d97a3a]">
                        ${food.price.toFixed(2)}
                      </p>
                    </div>
                    {food.description && (
                      <p className="line-clamp-2 text-[14px] text-[#666]">
                        {food.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(food.id)}
                    disabled={isAdding}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d97a3a] py-2.5 font-[family-name:var(--font-inter)] text-[15px] font-bold text-white transition-all hover:-translate-y-px hover:bg-[#cc6d2f] disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : justAdded ? (
                      <Check className="h-4 w-4" />
                    ) : null}
                    {isAdding ? "Adding…" : justAdded ? "Added" : "Add To Cart"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

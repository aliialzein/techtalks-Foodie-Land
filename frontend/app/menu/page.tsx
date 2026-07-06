"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  Loader2,
  Plus,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { getFoods, type Food } from "@/lib/foods";
import { useCurrentUser } from "@/lib/auth";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import AppHeader from "@/components/AppHeader";

export default function MenuPage() {
  const router = useRouter();
  const theme = useTheme();
  const dark = theme !== "light";
  const user = useCurrentUser();
  const { count, add } = useCart();

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    <div
      className={`relative min-h-screen overflow-hidden px-4 py-12 transition-all duration-500 ${
        dark
          ? "bg-linear-to-br from-[#0f0f0f] via-[#1a0a00] to-[#0f0f0f]"
          : "bg-linear-to-br from-[#fff7f0] via-[#ffe8d6] to-[#fff3eb]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-24 -right-20 h-96 w-96 rounded-full blur-[80px] ${
          dark ? "bg-orange-600/20" : "bg-orange-500/15"
        }`}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <AppHeader dark={dark} cartCount={count} active="menu" />

        <div className="mb-6">
          <h1
            className={`text-2xl font-semibold tracking-tight ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            Menu
          </h1>
          <p className={`text-sm ${dark ? "text-white/40" : "text-black/45"}`}>
            Add dishes to your cart
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className={`text-sm ${dark ? "text-white/40" : "text-black/45"}`}>
              Loading the menu…
            </p>
          </div>
        ) : error ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border py-16 text-center ${
              dark ? "border-white/8 bg-white/[0.03]" : "border-black/8 bg-white/50"
            }`}
          >
            <AlertCircle className="h-9 w-9 text-red-500" />
            <p className={`text-xs ${dark ? "text-white/40" : "text-black/45"}`}>
              {error}
            </p>
            <button
              type="button"
              onClick={load}
              className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
            >
              Try again
            </button>
          </div>
        ) : foods.length === 0 ? (
          <div
            className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${
              dark ? "border-white/8 bg-white/[0.03]" : "border-black/8 bg-white/50"
            }`}
          >
            <UtensilsCrossed className="h-9 w-9 text-orange-500" />
            <p className={`text-sm font-medium ${dark ? "text-white/80" : "text-gray-900"}`}>
              No dishes available yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {foods.map((food) => {
              const isAdding = addingId === food.id;
              const justAdded = addedId === food.id;
              return (
                <div
                  key={food.id}
                  className={`overflow-hidden rounded-2xl border backdrop-blur-xl ${
                    dark
                      ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
                      : "border-white/70 bg-white/60"
                  }`}
                >
                  <div className="flex h-24 items-center justify-center bg-linear-to-br from-orange-500/15 to-orange-400/5">
                    <UtensilsCrossed className="h-8 w-8 text-orange-500/70" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-sm font-semibold tracking-tight ${
                            dark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {food.name}
                        </p>
                        <p
                          className={`mt-0.5 flex items-center gap-1 text-[0.7rem] ${
                            dark ? "text-white/40" : "text-black/45"
                          }`}
                        >
                          <Store className="h-3 w-3" />
                          {food.restaurant.name}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          dark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${food.price.toFixed(2)}
                      </p>
                    </div>

                    {food.description && (
                      <p
                        className={`mt-2 line-clamp-2 text-xs ${
                          dark ? "text-white/40" : "text-black/45"
                        }`}
                      >
                        {food.description}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAdd(food.id)}
                      disabled={isAdding}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {isAdding ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : justAdded ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      {isAdding ? "Adding…" : justAdded ? "Added" : "Add to cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

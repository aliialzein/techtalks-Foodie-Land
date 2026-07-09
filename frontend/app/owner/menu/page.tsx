"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Loader2,
  Pencil,
  Plus,
  Store,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { useOwnerRestaurants } from "@/hooks/useOwnerRestaurants";
import {
  createFood,
  deleteFood,
  getFoods,
  updateFood,
  type Food,
} from "@/lib/foods";
import OwnerGate from "@/components/owner/OwnerGate";

export default function OwnerMenuPage() {
  return (
    <OwnerGate active="menu">
      {({ owner, dark }) => <MenuManager owner={owner} dark={dark} />}
    </OwnerGate>
  );
}

function MenuManager({ owner, dark }: { owner: SessionUser; dark: boolean }) {
  const { restaurants, loading: restLoading } = useOwnerRestaurants();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get(
      "restaurantId",
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromUrl) setSelectedId(fromUrl);
  }, []);

  const activeId = selectedId ?? restaurants[0]?.id ?? null;

  const [foods, setFoods] = useState<Food[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [addingOpen, setAddingOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const strongText = dark ? "text-white" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";
  const cardClass = dark
    ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
    : "border-white/70 bg-white/60";

  const loadFoods = useCallback(async (restaurantId: string) => {
    setFoodsLoading(true);
    try {
      setFoods(await getFoods(restaurantId));
    } catch {
      setFoods([]);
    } finally {
      setFoodsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFoods(activeId);
  }, [activeId, loadFoods]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setActionError("");
    try {
      await action();
      setAddingOpen(false);
      setEditingId(null);
      if (activeId) await loadFoods(activeId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (restLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className={`text-sm ${mutedText}`}>Loading…</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${cardClass}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
          <Store className="h-7 w-7 text-orange-500" />
        </div>
        <p className={`text-sm font-medium ${strongText}`}>No restaurant yet</p>
        <a
          href="/owner"
          className="rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-px"
        >
          Create one
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-semibold tracking-tight ${strongText}`}>
            Menu
          </h1>
          <p className={`text-sm ${mutedText}`}>Add, edit and manage your dishes</p>
        </div>
        <div className="flex items-center gap-2">
          {restaurants.length > 1 && (
            <select
              value={activeId ?? ""}
              onChange={(e) => setSelectedId(e.target.value)}
              className={`rounded-xl border px-3 py-2 text-sm outline-none ${
                dark
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-black/10 bg-white/70 text-gray-900"
              }`}
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
          {!addingOpen && (
            <button
              type="button"
              onClick={() => {
                setAddingOpen(true);
                setEditingId(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-px"
            >
              <Plus className="h-3.5 w-3.5" /> Add dish
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
            dark
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      {addingOpen && activeId && (
        <div className={`mb-4 rounded-2xl border p-5 ${cardClass}`}>
          <FoodForm
            dark={dark}
            busy={busy}
            submitLabel="Add dish"
            onCancel={() => setAddingOpen(false)}
            onSubmit={(values) =>
              run(() =>
                createFood({
                  ownerId: owner.id,
                  restaurantId: activeId,
                  ...values,
                }),
              )
            }
          />
        </div>
      )}

      {foodsLoading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
        </div>
      ) : foods.length === 0 && !addingOpen ? (
        <div
          className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${cardClass}`}
        >
          <UtensilsCrossed className="h-8 w-8 text-orange-500" />
          <p className={`text-sm font-medium ${strongText}`}>No dishes yet</p>
          <p className={`text-xs ${mutedText}`}>Add your first dish to the menu.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {foods.map((food) =>
            editingId === food.id ? (
              <div key={food.id} className={`rounded-2xl border p-5 ${cardClass}`}>
                <FoodForm
                  dark={dark}
                  busy={busy}
                  submitLabel="Save changes"
                  initial={food}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(values) =>
                    run(() => updateFood(food.id, { ownerId: owner.id, ...values }))
                  }
                />
              </div>
            ) : (
              <FoodRow
                key={food.id}
                food={food}
                dark={dark}
                busy={busy}
                onEdit={() => {
                  setEditingId(food.id);
                  setAddingOpen(false);
                }}
                onToggle={() =>
                  run(() =>
                    updateFood(food.id, {
                      ownerId: owner.id,
                      isAvailable: !food.isAvailable,
                    }),
                  )
                }
                onDelete={() => run(() => deleteFood(food.id, owner.id))}
              />
            ),
          )}
        </div>
      )}
    </>
  );
}

function FoodRow({
  food,
  dark,
  busy,
  onEdit,
  onToggle,
  onDelete,
}: {
  food: Food;
  dark: boolean;
  busy: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const strongText = dark ? "text-white" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";
  const cardClass = dark
    ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
    : "border-white/70 bg-white/60";

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 backdrop-blur-xl ${cardClass}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-500/15 to-orange-400/5">
        <UtensilsCrossed className="h-5 w-5 text-orange-500/70" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${strongText}`}>
          {food.name}
        </p>
        <p className={`text-xs ${mutedText}`}>${food.price.toFixed(2)}</p>
      </div>

      <span
        className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${
          food.isAvailable
            ? dark
              ? "border-green-500/25 bg-green-500/10 text-green-300"
              : "border-green-200 bg-green-50 text-green-700"
            : dark
              ? "border-white/10 bg-white/5 text-white/40"
              : "border-black/10 bg-black/5 text-black/40"
        }`}
      >
        {food.isAvailable ? "Available" : "Unavailable"}
      </span>

      <button
        type="button"
        onClick={onToggle}
        disabled={busy}
        className={`text-xs font-medium transition-colors disabled:opacity-40 ${
          dark ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"
        }`}
      >
        {food.isAvailable ? "Hide" : "Show"}
      </button>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit dish"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          dark ? "text-white/50 hover:bg-white/10" : "text-black/50 hover:bg-black/5"
        }`}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label="Delete dish"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
          dark
            ? "text-white/40 hover:bg-red-500/10 hover:text-red-400"
            : "text-black/40 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function FoodForm({
  dark,
  busy,
  submitLabel,
  initial,
  onSubmit,
  onCancel,
}: {
  dark: boolean;
  busy: boolean;
  submitLabel: string;
  initial?: Food;
  onSubmit: (values: {
    name: string;
    price: number;
    description?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(
    initial ? String(initial.price) : "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-[3px] focus:ring-orange-500/20 focus:border-orange-500 ${
    dark
      ? "bg-white/5 border border-white/10 text-white placeholder:text-white/20"
      : "bg-white/70 border border-black/10 text-gray-900 placeholder:text-black/25"
  }`;
  const labelClass = `block text-[0.7rem] font-medium tracking-widest uppercase mb-1.5 ${
    dark ? "text-white/35" : "text-black/40"
  }`;

  const priceNumber = Number(price);
  const canSubmit =
    name.trim().length >= 2 && price !== "" && priceNumber > 0 && !busy;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          name: name.trim(),
          price: priceNumber,
          description: description.trim() || undefined,
        });
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className={labelClass}>Dish name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Classic Burger"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="9.99"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (optional)"
          className={inputClass}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            dark
              ? "border-white/10 text-white/60 hover:bg-white/5"
              : "border-black/10 text-black/55 hover:bg-black/5"
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

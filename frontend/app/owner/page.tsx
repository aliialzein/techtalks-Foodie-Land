"use client";

import { useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { useOwnerRestaurants } from "@/hooks/useOwnerRestaurants";
import {
  createRestaurant,
  updateRestaurant,
  type Restaurant,
} from "@/lib/restaurants";
import OwnerGate from "@/components/owner/OwnerGate";

export default function OwnerDashboardPage() {
  return (
    <OwnerGate active="dashboard">
      {({ owner, dark }) => <Dashboard owner={owner} dark={dark} />}
    </OwnerGate>
  );
}

function Dashboard({ owner, dark }: { owner: SessionUser; dark: boolean }) {
  const { restaurants, loading, error, refresh } = useOwnerRestaurants();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const strongText = dark ? "text-white" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";
  const cardClass = dark
    ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
    : "border-white/70 bg-white/60";

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setActionError("");
    try {
      await action();
      setCreating(false);
      setEditingId(null);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-semibold tracking-tight ${strongText}`}>
            Your restaurants
          </h1>
          <p className={`text-sm ${mutedText}`}>
            Manage your restaurants, menus and orders
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-px"
          >
            <Plus className="h-3.5 w-3.5" /> New restaurant
          </button>
        )}
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

      {creating && (
        <div className={`mb-4 rounded-2xl border p-5 ${cardClass}`}>
          <RestaurantForm
            dark={dark}
            busy={busy}
            submitLabel="Create restaurant"
            onCancel={() => setCreating(false)}
            onSubmit={(values) =>
              run(() => createRestaurant({ ownerId: owner.id, ...values }))
            }
          />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-24">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className={`text-sm ${mutedText}`}>Loading your restaurants…</p>
        </div>
      ) : error ? (
        <p className={`text-sm ${mutedText}`}>{error}</p>
      ) : restaurants.length === 0 && !creating ? (
        <div
          className={`flex flex-col items-center gap-3 rounded-2xl border py-20 text-center ${cardClass}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
            <Store className="h-7 w-7 text-orange-500" />
          </div>
          <p className={`text-sm font-medium ${strongText}`}>
            You don&apos;t have a restaurant yet
          </p>
          <p className={`text-xs ${mutedText}`}>
            Create one to start building your menu.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {restaurants.map((restaurant) =>
            editingId === restaurant.id ? (
              <div
                key={restaurant.id}
                className={`rounded-2xl border p-5 ${cardClass}`}
              >
                <RestaurantForm
                  dark={dark}
                  busy={busy}
                  submitLabel="Save changes"
                  initial={restaurant}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(values) =>
                    run(() => updateRestaurant(restaurant.id, values))
                  }
                />
              </div>
            ) : (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                dark={dark}
                busy={busy}
                onEdit={() => {
                  setEditingId(restaurant.id);
                  setCreating(false);
                }}
                onToggleActive={() =>
                  run(() =>
                    updateRestaurant(restaurant.id, {
                      isActive: !restaurant.isActive,
                    }),
                  )
                }
              />
            ),
          )}
        </div>
      )}
    </>
  );
}

function RestaurantCard({
  restaurant,
  dark,
  busy,
  onEdit,
  onToggleActive,
}: {
  restaurant: Restaurant;
  dark: boolean;
  busy: boolean;
  onEdit: () => void;
  onToggleActive: () => void;
}) {
  const strongText = dark ? "text-white" : "text-gray-900";
  const mutedText = dark ? "text-white/40" : "text-black/45";
  const cardClass = dark
    ? "border-white/8 bg-[rgba(20,10,5,0.55)]"
    : "border-white/70 bg-white/60";
  const q = `?restaurantId=${restaurant.id}`;

  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-600 to-orange-400 shadow-[0_4px_12px_rgba(234,88,12,0.35)]">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className={`text-sm font-semibold tracking-tight ${strongText}`}>
              {restaurant.name}
            </p>
            <p className={`text-xs ${mutedText}`}>
              {restaurant.description || "No description"}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            restaurant.isActive
              ? dark
                ? "border-green-500/25 bg-green-500/10 text-green-300"
                : "border-green-200 bg-green-50 text-green-700"
              : dark
                ? "border-white/10 bg-white/5 text-white/40"
                : "border-black/10 bg-black/5 text-black/40"
          }`}
        >
          {restaurant.isActive ? "Active" : "Hidden"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={`/owner/menu${q}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-px"
        >
          <UtensilsCrossed className="h-3.5 w-3.5" /> Menu
        </a>
        <a
          href={`/owner/orders${q}`}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            dark
              ? "border-white/10 text-white/70 hover:bg-white/5"
              : "border-black/10 text-black/60 hover:bg-black/5"
          }`}
        >
          <ClipboardList className="h-3.5 w-3.5" /> Orders
        </a>
        <button
          type="button"
          onClick={onEdit}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            dark
              ? "border-white/10 text-white/70 hover:bg-white/5"
              : "border-black/10 text-black/60 hover:bg-black/5"
          }`}
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          type="button"
          onClick={onToggleActive}
          disabled={busy}
          className={`ml-auto text-xs font-medium transition-colors disabled:opacity-40 ${
            dark ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"
          }`}
        >
          {restaurant.isActive ? "Hide from customers" : "Make active"}
        </button>
      </div>
    </div>
  );
}

function RestaurantForm({
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
  initial?: Restaurant;
  onSubmit: (values: { name: string; description?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-[3px] focus:ring-orange-500/20 focus:border-orange-500 ${
    dark
      ? "bg-white/5 border border-white/10 text-white placeholder:text-white/20"
      : "bg-white/70 border border-black/10 text-gray-900 placeholder:text-black/25"
  }`;
  const labelClass = `block text-[0.7rem] font-medium tracking-widest uppercase mb-1.5 ${
    dark ? "text-white/35" : "text-black/40"
  }`;

  const canSubmit = name.trim().length >= 2 && !busy;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <label className={labelClass}>Restaurant name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Demo Diner"
          className={inputClass}
        />
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

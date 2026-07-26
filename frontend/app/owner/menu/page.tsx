"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  FileDown,
  FolderPlus,
  Loader2,
  LogIn,
  Pencil,
  Plus,
  ShieldAlert,
  Store,
  Trash2,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { useCurrentUser } from "@/lib/auth";
import { useOwnerRestaurants } from "@/hooks/useOwnerRestaurants";
import {
  createFood,
  deleteFood,
  getFoods,
  updateFood,
  type Food,
} from "@/lib/foods";
import PanelHeader from "@/components/owner/PanelHeader";
import { generatePdfReport } from "@/lib/pdf";

const CATEGORIES = ["Appetizers", "Main Course", "Desserts", "Drinks"];

export default function OwnerMenuPage() {
  const user = useCurrentUser();
  const isOwner = user?.role === "OWNER" || user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <PanelHeader active="menu" />
      {!user ? (
        <Notice
          icon={<LogIn className="h-7 w-7 text-[#d97a3a]" />}
          title="Sign in to manage your restaurant"
          cta="Go to sign in"
          href="/login"
        />
      ) : !isOwner ? (
        <Notice
          icon={<ShieldAlert className="h-7 w-7 text-[#d97a3a]" />}
          title="This area is for restaurant owners"
          cta="Back to the menu"
          href="/menu"
        />
      ) : (
        <MenuManager owner={user} />
      )}
      <PanelFooter />
    </div>
  );
}

function MenuManager({ owner }: { owner: SessionUser }) {
  const { restaurants, loading: restLoading } = useOwnerRestaurants();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [addingOpen, setAddingOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("restaurantId");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromUrl) setSelectedId(fromUrl);
  }, []);

  const activeId = selectedId ?? restaurants[0]?.id ?? null;
  const activeRestaurant = restaurants.find((r) => r.id === activeId) ?? restaurants[0];

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

  const editing = foods.find((f) => f.id === editingId) ?? null;

  const exportMenuPdf = () => {
    generatePdfReport({
      title: "Menu Catalog",
      subtitle: activeRestaurant?.name
        ? `${activeRestaurant.name} — current menu items`
        : "Current menu items",
      fileName: `foodspot-menu-${(activeRestaurant?.name ?? "restaurant")
        .toLowerCase()
        .replace(/\s+/g, "-")}.pdf`,
      sections: [
        {
          type: "stats",
          items: [
            { label: "Total Items", value: String(foods.length) },
            {
              label: "Available",
              value: String(foods.filter((f) => f.isAvailable).length),
            },
            {
              label: "Sold Out",
              value: String(foods.filter((f) => !f.isAvailable).length),
            },
          ],
        },
        {
          type: "table",
          title: "Items",
          head: ["Name", "Price", "Status", "Description"],
          body: foods.map((f) => [
            f.name,
            `$${f.price.toFixed(2)}`,
            f.isAvailable ? "Available" : "Sold Out",
            f.description || "—",
          ]),
        },
      ],
    });
  };

  if (restLoading) {
    return (
      <main className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#d97a3a]" />
      </main>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Notice
        icon={<Store className="h-7 w-7 text-[#d97a3a]" />}
        title="No restaurant yet"
        cta="Create one"
        href="/owner"
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
      <h1 className="text-center text-[28px] font-bold text-[#1a1c1c] lg:text-[34px]">
        Welcome {(activeRestaurant?.name ?? "back").toUpperCase()} !
      </h1>

      <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-[#1a1c1c]">Menu Catalog</h2>
          <p className="mt-1 max-w-[420px] text-[14px] text-[#8a8a8a]">
            Manage your restaurant&apos;s digital menu, organize categories, and
            track item availability.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-[family-name:var(--font-inter)] text-[14px]">
          {restaurants.length > 1 && (
            <select
              value={activeId ?? ""}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-lg border border-[#e2e2e2] bg-white px-3 py-2.5 text-[#242424] outline-none"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
          <span className="inline-flex cursor-default items-center gap-2 rounded-lg bg-[#f1efee] px-4 py-2.5 font-medium text-[#636262]">
            <FolderPlus className="h-4 w-4" /> Add New Category
          </span>
          <button
            type="button"
            onClick={exportMenuPdf}
            disabled={foods.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e2e2e2] px-4 py-2.5 font-semibold text-[#242424] transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileDown className="h-4 w-4" /> Export to PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setAddingOpen(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d97a3a] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#cc6d2f]"
          >
            <Plus className="h-4 w-4" /> Add New Plate
          </button>
        </div>
      </div>

      {/* Decorative category tabs (backend has no categories yet) */}
      <div className="mt-6 flex flex-wrap gap-6 border-b border-[#eef0f3] font-[family-name:var(--font-inter)] text-[15px]">
        {CATEGORIES.map((c, i) => (
          <span
            key={c}
            className={
              i === 0
                ? "-mb-px border-b-2 border-[#d97a3a] pb-3 font-semibold text-[#d97a3a]"
                : "pb-3 text-[#8a8a8a]"
            }
          >
            {c}
          </span>
        ))}
      </div>

      {actionError && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      {(addingOpen || editing) && activeId && (
        <div className="mt-6 rounded-xl border border-[#f0dccb] bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
          <h3 className="mb-4 text-[18px] font-bold text-[#1a1c1c]">
            {editing ? "Edit plate" : "Add new plate"}
          </h3>
          <FoodForm
            busy={busy}
            submitLabel={editing ? "Save changes" : "Add plate"}
            initial={editing ?? undefined}
            onCancel={() => {
              setAddingOpen(false);
              setEditingId(null);
            }}
            onSubmit={(values) =>
              run(() =>
                editing
                  ? updateFood(editing.id, { ownerId: owner.id, ...values })
                  : createFood({ ownerId: owner.id, restaurantId: activeId, ...values }),
              )
            }
          />
        </div>
      )}

      {foodsLoading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <Loader2 className="h-7 w-7 animate-spin text-[#d97a3a]" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
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
          ))}
          {/* Add-new placeholder card */}
          <button
            type="button"
            onClick={() => {
              setAddingOpen(true);
              setEditingId(null);
            }}
            className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e0c3b2] text-[#8a8a8a] transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8ddc9]">
              <Plus className="h-5 w-5 text-[#d97a3a]" />
            </span>
            <span className="text-[14px] font-medium">Add New Plate</span>
          </button>
        </div>
      )}
    </main>
  );
}

function FoodCard({
  food,
  busy,
  onEdit,
  onToggle,
  onDelete,
}: {
  food: Food;
  busy: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#eef0f3] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.04)]">
      <div className="relative">
        <img src="/home/menu-plate.jpg" alt={food.name} className="h-[168px] w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-[#d97a3a] px-3 py-1 text-[12px] font-semibold text-white">
          ${food.price.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={onToggle}
          disabled={busy}
          title="Toggle availability"
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 ${
            food.isAvailable ? "bg-green-100 text-green-700" : "bg-black/50 text-white"
          }`}
        >
          {food.isAvailable ? "Available" : "Sold Out"}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[17px] font-bold text-[#181818]">{food.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-[#8a8a8a]">
          {food.description || "No description"}
        </p>
        <div className="mt-4 flex items-center gap-2 border-t border-[#f4f4f4] pt-4 font-[family-name:var(--font-inter)] text-[13px]">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e2e2e2] px-4 py-1.5 font-medium text-[#242424] transition-colors hover:border-[#d97a3a] hover:text-[#d97a3a]"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-1.5 font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function FoodForm({
  busy,
  submitLabel,
  initial,
  onSubmit,
  onCancel,
}: {
  busy: boolean;
  submitLabel: string;
  initial?: Food;
  onSubmit: (values: { name: string; price: number; description?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const inputClass =
    "w-full rounded-lg border border-[#e2e2e2] bg-white px-3.5 py-2.5 text-sm text-[#242424] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#d97a3a] focus:ring-[3px] focus:ring-[#d97a3a]/15";
  const labelClass = "mb-1.5 block text-[13px] font-semibold text-[#d97a3a]";

  const priceNumber = Number(price);
  const canSubmit = name.trim().length >= 2 && price !== "" && priceNumber > 0 && !busy;

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
      <div className="flex gap-2 font-[family-name:var(--font-inter)]">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d97a3a] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#cc6d2f] disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#e2e2e2] px-5 py-2.5 text-sm font-medium text-[#636262] transition-colors hover:bg-black/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Notice({
  icon,
  title,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  cta: string;
  href: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-[#eef0f3] bg-white py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8ddc9]">
          {icon}
        </div>
        <p className="text-[15px] font-medium text-[#242424]">{title}</p>
        <a
          href={href}
          className="rounded-full bg-[#d97a3a] px-6 py-2.5 font-[family-name:var(--font-inter)] text-sm font-bold text-white transition-colors hover:bg-[#cc6d2f]"
        >
          {cta}
        </a>
      </div>
    </main>
  );
}

function PanelFooter() {
  return (
    <footer className="border-t border-[#eef0f3] bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center gap-3 px-6 py-5 text-[13px] text-[#8a8a8a]">
        <img src="/home/logo.png" alt="FoodSpot" className="h-6 w-auto" />
        <span>© 2026 Food Spot — Restaurant Admin Panel. All rights reserved.</span>
      </div>
    </footer>
  );
}

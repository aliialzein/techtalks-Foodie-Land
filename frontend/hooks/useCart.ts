"use client";

import { useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/auth";
import {
  addToCart,
  cartCount,
  cartSubtotal,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
  type Cart,
} from "@/lib/cart";

// Owns the signed-in user's cart: loads it on mount and exposes mutations that
// each return the fresh cart from the server, so state stays in sync without
// manual refetching. No-ops gracefully when there's no session.
export function useCart() {
  const user = useCurrentUser();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (userId: string) => {
    setLoading(true);
    setError("");
    try {
      setCart(await getCart(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (user) {
      void refresh(user.id);
    } else {
      setLoading(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user, refresh]);

  const run = useCallback(async (action: () => Promise<Cart>) => {
    setBusy(true);
    setError("");
    try {
      setCart(await action());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }, []);

  const add = useCallback(
    (foodId: string, quantity = 1) => {
      if (!user) return Promise.resolve();
      return run(() => addToCart(user.id, foodId, quantity));
    },
    [user, run],
  );

  const setQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (!user) return Promise.resolve();
      return run(() => updateCartItem(user.id, itemId, quantity));
    },
    [user, run],
  );

  const remove = useCallback(
    (itemId: string) => {
      if (!user) return Promise.resolve();
      return run(() => removeCartItem(user.id, itemId));
    },
    [user, run],
  );

  const clear = useCallback(() => {
    if (!user) return Promise.resolve();
    return run(() => clearCart(user.id));
  }, [user, run]);

  return {
    user,
    cart,
    items: cart?.items ?? [],
    count: cartCount(cart),
    subtotal: cartSubtotal(cart),
    loading,
    busy,
    error,
    add,
    setQuantity,
    remove,
    clear,
  };
}

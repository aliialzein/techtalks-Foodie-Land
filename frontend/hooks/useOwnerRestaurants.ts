"use client";

import { useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/auth";
import { getMyRestaurants, type Restaurant } from "@/lib/restaurants";

// Loads the restaurants owned by the signed-in user.
export function useOwnerRestaurants() {
  const user = useCurrentUser();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (ownerId: string) => {
    setLoading(true);
    setError("");
    try {
      setRestaurants(await getMyRestaurants(ownerId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load your restaurants.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (user) {
      void load(user.id);
    } else {
      setLoading(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user, load]);

  return {
    user,
    restaurants,
    loading,
    error,
    refresh: () => {
      if (user) void load(user.id);
    },
  };
}

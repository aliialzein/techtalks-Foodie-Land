"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, useCurrentUser } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RestaurantRootPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <RestaurantRootContent />
    </ProtectedRoute>
  );
}

function RestaurantRootContent() {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    async function loadFlow() {
      if (!user?.id) {
        router.replace("/login");
        return;
      }

      try {
        const session = getSession();
        const token = session?.token ?? "";
        const res = await fetch("/api/restaurants?ownerId=" + user.id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const restaurants = await res.json();
        const restaurant = Array.isArray(restaurants) ? restaurants[0] : null;

        if (!restaurant) {
          router.replace("/restaurant/register");
          return;
        }

        if (restaurant.status === "PENDING") {
          router.replace("/restaurant/pending");
          return;
        }

        if (restaurant.status === "REJECTED") {
          router.replace("/restaurant/rejected");
          return;
        }

        router.replace("/restaurant/dashboard");
      } catch {
        router.replace("/restaurant/register");
      }
    }

    loadFlow();
  }, [router, user]);

  return null;
}

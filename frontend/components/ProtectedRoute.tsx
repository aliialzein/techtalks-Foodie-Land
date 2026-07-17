"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, type UserRole } from "@/lib/auth";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Array<UserRole>;
}) {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role as UserRole)) {
      router.replace("/unauthorized");
    }
  }, [allowedRoles, router, user]);

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
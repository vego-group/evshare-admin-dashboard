"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useAuthPermissions } from "@/hooks/api";
import { removeToken } from "@/lib";
import { clearUserSession } from "@/lib/utils/user-session";

type PermissionsContextValue = {
  permissions: string[];
  isLoading: boolean;
  hasPermission: (slug: string) => boolean;
  hasAnyPermission: (slug: string | string[]) => boolean;
};

const PermissionsContext = createContext<PermissionsContextValue>({
  permissions: [],
  isLoading: false,
  hasPermission: () => false,
  hasAnyPermission: () => false,
});

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isSuccess } = useAuthPermissions();

  const permissions = useMemo(
    () => (data?.data ?? []).map((permission) => permission.slug),
    [data],
  );

  const isUnauthorized = isSuccess && permissions.length === 0;

  useEffect(() => {
    if (!isUnauthorized) return;
    void removeToken();
    clearUserSession();
    window.location.replace("/login?unauthorized=1");
  }, [isUnauthorized]);

  const value = useMemo<PermissionsContextValue>(() => {
    const slugs = new Set(permissions);
    return {
      permissions,
      isLoading,
      hasPermission: (slug: string) => slugs.has(slug),
      hasAnyPermission: (slug: string | string[]) =>
        Array.isArray(slug) ? slug.some((s) => slugs.has(s)) : slugs.has(slug),
    };
  }, [permissions, isLoading]);

  if (isUnauthorized) return null;

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissionsContext = () => useContext(PermissionsContext);

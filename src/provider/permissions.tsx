"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuthPermissions } from "@/hooks/api";

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
  const { data, isLoading } = useAuthPermissions();

  const permissions = useMemo(
    () => (data?.data ?? []).map((permission) => permission.slug),
    [data],
  );

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

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissionsContext = () => useContext(PermissionsContext);

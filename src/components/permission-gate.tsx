"use client";

import type { ReactNode } from "react";
import { useUserPermissions } from "@/hooks";

type PermissionGateProps = {
  slug: string | readonly string[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
};

function PermissionGate({ slug, children, fallback = null, requireAll = false }: PermissionGateProps) {
  const { isLoading, hasAnyPermission, hasPermission } = useUserPermissions();
  if (isLoading) return null;
  const normalizedSlug: string | string[] =
    typeof slug === "string" ? slug : [...slug];
  const allowed = requireAll && Array.isArray(normalizedSlug)
    ? normalizedSlug.every(hasPermission)
    : hasAnyPermission(normalizedSlug);
  return allowed ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;

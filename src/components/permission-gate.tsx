"use client";

import type { ReactNode } from "react";
import { useUserPermissions } from "@/hooks";

type PermissionGateProps = {
  slug: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
};

function PermissionGate({ slug, children, fallback = null, requireAll = false }: PermissionGateProps) {
  const { isLoading, hasAnyPermission, hasPermission } = useUserPermissions();
  if (isLoading) return null;
  const allowed = requireAll && Array.isArray(slug)
    ? slug.every(hasPermission)
    : hasAnyPermission(slug);
  return allowed ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;

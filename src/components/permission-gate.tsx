"use client";

import type { ReactNode } from "react";
import { useUserPermissions } from "@/hooks";

type PermissionGateProps = {
  slug: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
};

function PermissionGate({ slug, children, fallback = null }: PermissionGateProps) {
  const { isLoading, hasAnyPermission } = useUserPermissions();
  if (isLoading) return null;
  const allowed = hasAnyPermission(slug);
  return allowed ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;

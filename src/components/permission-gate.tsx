"use client";

import type { ReactNode } from "react";
import { useHasPermission } from "@/hooks";

type PermissionGateProps = {
  slug: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
};

function PermissionGate({ slug, children, fallback = null }: PermissionGateProps) {
  const allowed = useHasPermission(slug);
  return allowed ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;

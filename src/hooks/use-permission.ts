import { usePermissionsContext } from "@/provider/permissions";

export const useUserPermissions = () => usePermissionsContext();

export const useHasPermission = (slug: string | string[]) =>
  usePermissionsContext().hasAnyPermission(slug);

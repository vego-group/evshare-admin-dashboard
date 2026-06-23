import {
  permissionCategoriesAPI,
  permissionCategoryDetailsAPI,
  permissionDetailsAPI,
  permissionsAPI,
  roleDetailsAPI,
  rolesAPI,
} from "@/services/queries";
import type { RolesPermissionsQueryParams } from "@/types";
import type {
  AssignPermissionCategoryValues,
  PermissionCategoryFormValues,
  PermissionFormValues,
  RoleEditFormValues,
  RoleFormValues,
  SyncRolePermissionsValues,
} from "@/schemas/roles-permissions";
import {
  addPermission,
  addPermissionCategory,
  addPermissionToRole,
  addRole,
  assignRolePermissionsByCategory,
  deletePermission,
  deletePermissionCategory,
  deleteRole,
  editPermission,
  editPermissionCategory,
  editRole,
  removePermissionFromRole,
  syncRolePermissions,
} from "@/services/mutations";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useCustomQuery } from "..";

export const rolesPermissionsKeys = {
  roles: ["roles"] as const,
  role: ["role"] as const,
  permissions: ["permissions"] as const,
  permission: ["permission"] as const,
  categories: ["permission-categories"] as const,
  category: ["permission-category"] as const,
};

export const useRoles = (params: RolesPermissionsQueryParams) =>
  useCustomQuery(["roles", params], () => rolesAPI(params));

export const useRole = (roleId: string | null) =>
  useCustomQuery(["role", roleId], () => roleDetailsAPI(roleId!), {
    enabled: Boolean(roleId),
  });

export const usePermissions = (params: RolesPermissionsQueryParams) =>
  useCustomQuery(["permissions", params], () => permissionsAPI(params));

export const usePermission = (permissionId: string | null) =>
  useCustomQuery(["permission", permissionId], () => permissionDetailsAPI(permissionId!), {
    enabled: Boolean(permissionId),
  });

export const usePermissionCategories = (params: RolesPermissionsQueryParams) =>
  useCustomQuery(["permission-categories", params], () => permissionCategoriesAPI(params));

export const usePermissionCategory = (categoryId: string | null) =>
  useCustomQuery(
    ["permission-category", categoryId],
    () => permissionCategoryDetailsAPI(categoryId!),
    { enabled: Boolean(categoryId) },
  );

const useInvalidate = (...keys: QueryKey[]) => {
  const client = useQueryClient();
  return () => Promise.all(keys.map((queryKey) => client.invalidateQueries({ queryKey })));
};

export const useAddRole = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.roles);
  return useMutation({ mutationFn: (payload: RoleFormValues) => addRole(payload), onSuccess: invalidate });
};
export const useEditRole = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.roles, rolesPermissionsKeys.role);
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: RoleEditFormValues }) => editRole(id, payload), onSuccess: invalidate });
};
export const useDeleteRole = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.roles);
  return useMutation({ mutationFn: deleteRole, onSuccess: invalidate });
};
export const useAddPermissionToRole = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.roles, rolesPermissionsKeys.role);
  return useMutation({ mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) => addPermissionToRole(roleId, permissionId), onSuccess: invalidate });
};
export const useRemovePermissionFromRole = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.roles, rolesPermissionsKeys.role);
  return useMutation({ mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) => removePermissionFromRole(roleId, permissionId), onSuccess: invalidate });
};
export const useSyncRolePermissions = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.roles, rolesPermissionsKeys.role);
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: SyncRolePermissionsValues }) => syncRolePermissions(id, payload), onSuccess: invalidate });
};
export const useAssignRolePermissionsByCategory = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.roles, rolesPermissionsKeys.role);
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: AssignPermissionCategoryValues }) => assignRolePermissionsByCategory(id, payload), onSuccess: invalidate });
};

export const useAddPermission = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.permissions);
  return useMutation({ mutationFn: (payload: PermissionFormValues) => addPermission(payload), onSuccess: invalidate });
};
export const useEditPermission = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.permissions, rolesPermissionsKeys.permission);
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: PermissionFormValues }) => editPermission(id, payload), onSuccess: invalidate });
};
export const useDeletePermission = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.permissions);
  return useMutation({ mutationFn: deletePermission, onSuccess: invalidate });
};

export const useAddPermissionCategory = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.categories);
  return useMutation({ mutationFn: (payload: PermissionCategoryFormValues) => addPermissionCategory(payload), onSuccess: invalidate });
};
export const useEditPermissionCategory = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.categories, rolesPermissionsKeys.category);
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: PermissionCategoryFormValues }) => editPermissionCategory(id, payload), onSuccess: invalidate });
};
export const useDeletePermissionCategory = () => {
  const invalidate = useInvalidate(rolesPermissionsKeys.categories, rolesPermissionsKeys.permissions);
  return useMutation({ mutationFn: deletePermissionCategory, onSuccess: invalidate });
};

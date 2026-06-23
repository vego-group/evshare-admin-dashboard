"use server";

import type {
  AssignPermissionCategoryValues,
  PermissionCategoryFormValues,
  PermissionFormValues,
  RoleEditFormValues,
  RoleFormValues,
  SyncRolePermissionsValues,
} from "@/schemas/roles-permissions";
import { safeApi } from "..";

export const addRole = async (payload: RoleFormValues) =>
  await safeApi("POST", "/roles/add", payload);
export const editRole = async (roleId: string, payload: RoleEditFormValues) =>
  await safeApi("POST", `/roles/${roleId}/edit`, payload);
export const deleteRole = async (roleId: string) =>
  await safeApi("POST", `/roles/${roleId}/delete`);
export const addPermissionToRole = async (roleId: string, permissionId: string) =>
  await safeApi("POST", `/roles/${roleId}/permissions/${permissionId}/add`);
export const removePermissionFromRole = async (roleId: string, permissionId: string) =>
  await safeApi("POST", `/roles/${roleId}/permissions/${permissionId}/delete`);
export const syncRolePermissions = async (roleId: string, payload: SyncRolePermissionsValues) =>
  await safeApi("POST", `/roles/${roleId}/permissions/sync`, payload);
export const assignRolePermissionsByCategory = async (
  roleId: string,
  payload: AssignPermissionCategoryValues,
) => await safeApi("POST", `/roles/${roleId}/permissions/assign-category`, payload);

export const addPermission = async (payload: PermissionFormValues) =>
  await safeApi("POST", "/permissions/add", payload);
export const editPermission = async (permissionId: string, payload: PermissionFormValues) =>
  await safeApi("POST", `/permissions/${permissionId}/edit`, payload);
export const deletePermission = async (permissionId: string) =>
  await safeApi("POST", `/permissions/${permissionId}/delete`);

export const addPermissionCategory = async (payload: PermissionCategoryFormValues) =>
  await safeApi("POST", "/permission-categories/add", payload);
export const editPermissionCategory = async (
  categoryId: string,
  payload: PermissionCategoryFormValues,
) => await safeApi("POST", `/permission-categories/${categoryId}/edit`, payload);
export const deletePermissionCategory = async (categoryId: string) =>
  await safeApi("POST", `/permission-categories/${categoryId}/delete`);

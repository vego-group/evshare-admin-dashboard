import { buildQuery } from "@/lib/utils/build-query";
import type {
  PermissionCategoriesListResponse,
  PermissionCategoryDetailResponse,
  PermissionDetailResponse,
  PermissionsListResponse,
  RoleDetailResponse,
  RolesListResponse,
  RolesPermissionsPaginationMeta,
  RolesPermissionsQueryParams,
} from "@/types";
import { baseAPI } from "..";

type ApiRecord = Record<string, unknown>;
const asRecord = (value: unknown): ApiRecord | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ApiRecord
    : null;

const readItems = <T>(response: ApiRecord): T[] => {
  const data = response.data;
  if (Array.isArray(data)) return data as T[];
  const nested = asRecord(data);
  if (!nested) return [];
  const candidates = [
    nested.data,
    nested.items,
    nested.roles,
    nested.permissions,
    nested.permission_categories,
    nested.permissionCategories,
  ];
  return (candidates.find(Array.isArray) as T[] | undefined) ?? [];
};

const readMeta = (
  response: ApiRecord,
  count: number,
  params: RolesPermissionsQueryParams,
): RolesPermissionsPaginationMeta => {
  const data = asRecord(response.data);
  const raw = asRecord(response.meta) ?? asRecord(data?.meta) ??
    asRecord(response.pagination) ?? asRecord(data?.pagination) ?? data ?? {};
  const number = (camel: string, snake: string, fallback: number) =>
    Number(raw[camel] ?? raw[snake] ?? fallback);
  return {
    currentPage: number("currentPage", "current_page", params.page),
    lastPage: number("lastPage", "last_page", 1),
    perPage: number("perPage", "per_page", params.limit),
    total: number("total", "total", count),
  };
};

const normalizeList = <T>(value: unknown, params: RolesPermissionsQueryParams) => {
  const response = asRecord(value) ?? {};
  const data = readItems<T>(response);
  return {
    error: Boolean(response.error),
    message: typeof response.message === "string" ? response.message : "",
    data,
    meta: readMeta(response, data.length, params),
  };
};

const withQuery = (path: string, params: RolesPermissionsQueryParams) => {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    order_by: params.order_by,
  });
  return query ? `${path}?${query}` : path;
};

export const rolesAPI = async (params: RolesPermissionsQueryParams): Promise<RolesListResponse> =>
  normalizeList(await baseAPI("GET", withQuery("/roles", params)), params);

export const roleDetailsAPI = (roleId: string): Promise<RoleDetailResponse> =>
  baseAPI("GET", `/roles/${roleId}`);

export const permissionsAPI = (
  params: RolesPermissionsQueryParams,
): Promise<PermissionsListResponse> =>
  baseAPI("GET", withQuery("/permissions", params)).then((value) => normalizeList(value, params));

export const permissionDetailsAPI = (
  permissionId: string,
): Promise<PermissionDetailResponse> => baseAPI("GET", `/permissions/${permissionId}`);

export const permissionCategoriesAPI = (
  params: RolesPermissionsQueryParams,
): Promise<PermissionCategoriesListResponse> =>
  baseAPI("GET", withQuery("/permission-categories", params)).then((value) => normalizeList(value, params));

export const permissionCategoryDetailsAPI = (
  categoryId: string,
): Promise<PermissionCategoryDetailResponse> =>
  baseAPI("GET", `/permission-categories/${categoryId}`);

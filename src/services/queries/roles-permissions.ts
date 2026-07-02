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
  const fallbackPage = params.page ?? 1;
  const fallbackLimit = params.limit ?? Math.max(count, 1);
  const currentPage = numberValue(raw, ["currentPage", "current_page", "page"], fallbackPage);
  const perPage = numberValue(raw, ["perPage", "per_page", "limit"], fallbackLimit);
  const total = numberValue(raw, ["total", "totalItems", "total_items"], count, { allowZero: true });
  const lastPage = numberValue(
    raw,
    ["lastPage", "last_page", "totalPages", "total_pages", "pages"],
    Math.max(1, Math.ceil(total / Math.max(1, perPage))),
  );

  return {
    currentPage,
    lastPage,
    perPage,
    total,
  };
};

const numberValue = (
  source: ApiRecord,
  keys: string[],
  fallback: number,
  options: { allowZero?: boolean } = {},
) => {
  const value = keys.map((key) => source[key]).find((item) => item !== undefined && item !== null);
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed > 0 || (options.allowZero && parsed === 0) ? parsed : fallback;
};

const normalizeList = <T>(value: unknown, params: RolesPermissionsQueryParams) => {
  const response = asRecord(value) ?? {};
  const items = readItems<T>(response);
  const hasServerMeta = hasPaginationMeta(response);
  const hasClientPagination = params.page !== undefined && params.limit !== undefined;
  const data = hasServerMeta || !hasClientPagination ? items : slicePage(items, params);
  return {
    error: Boolean(response.error),
    message: typeof response.message === "string" ? response.message : "",
    data,
    meta: readMeta(response, items.length, params),
  };
};

const hasPaginationMeta = (response: ApiRecord) => {
  const data = asRecord(response.data);
  const sources = [
    asRecord(response.meta),
    asRecord(data?.meta),
    asRecord(response.pagination),
    asRecord(data?.pagination),
    data,
  ].filter(Boolean) as ApiRecord[];
  return sources.some((source) =>
    [
      "currentPage",
      "current_page",
      "page",
      "lastPage",
      "last_page",
      "totalPages",
      "total_pages",
      "perPage",
      "per_page",
      "total",
    ].some((key) => source[key] !== undefined),
  );
};

const slicePage = <T>(items: T[], params: RolesPermissionsQueryParams) => {
  const limit = Math.max(1, params.limit ?? items.length);
  const start = Math.max(0, (params.page ?? 1) - 1) * limit;
  return items.slice(start, start + limit);
};

const withPaginatedQuery = (path: string, params: RolesPermissionsQueryParams) => {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    order_by: params.order_by,
  });
  return query ? `${path}?${query}` : path;
};

export const rolesAPI = async (params: RolesPermissionsQueryParams): Promise<RolesListResponse> =>
  normalizeList(await baseAPI("GET", withPaginatedQuery("/roles", params)), params);

export const roleDetailsAPI = (roleId: string): Promise<RoleDetailResponse> =>
  baseAPI("GET", `/roles/${roleId}`);

export const permissionsAPI = (
  params: RolesPermissionsQueryParams,
): Promise<PermissionsListResponse> =>
  baseAPI("GET", withPaginatedQuery("/permissions", params)).then((value) => normalizeList(value, params));

export const permissionDetailsAPI = (
  permissionId: string,
): Promise<PermissionDetailResponse> => baseAPI("GET", `/permissions/${permissionId}`);

export const permissionCategoriesAPI = (
  params: RolesPermissionsQueryParams,
): Promise<PermissionCategoriesListResponse> =>
  baseAPI("GET", withPaginatedQuery("/permission-categories", params)).then((value) => normalizeList(value, params));

export const permissionCategoryDetailsAPI = (
  categoryId: string,
): Promise<PermissionCategoryDetailResponse> =>
  baseAPI("GET", `/permission-categories/${categoryId}`);

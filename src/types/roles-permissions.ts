export type RolesPermissionsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: "asc" | "desc";
};

export type Permission = {
  id: string;
  name: string;
  slug?: string;
  name_ar: string;
  name_en: string;
  permission_category_id: string | null;
  permission_category: PermissionCategorySummary | null;
  dashboard_permissions: boolean;
  created_at: string;
  updated_at: string;
};

export type Role = {
  id: string;
  name: string;
  /** Public-registration flag returned by the API; dashboard forms must not edit it. */
  allowed_user?: boolean | 0 | 1;
  permissions?: Permission[];
};

export type CreatedRole = Role & {
  /** Informational only: copied roles do not retain a relationship to the source. */
  copied_from?: Pick<Role, "id" | "name">;
};

export type PermissionCategorySummary = {
  id: string;
  name: string;
  name_ar: string | null;
  name_en: string | null;
};

export type PermissionCategory = {
  id: string;
  name: string;
  name_ar: string | null;
  name_en: string | null;
  slug: string;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
};

export type RolesPermissionsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PaginatedResponse<T> = {
  error: boolean;
  message: string;
  data: T[];
  meta: RolesPermissionsPaginationMeta;
};

export type DetailResponse<T> = {
  error: boolean;
  message: string;
  data: T;
};

export type AuthPermission = {
  id: string;
  slug: string;
  name?: string;
};

export type AuthPermissionsResponse = {
  status: boolean;
  message: string;
  data: AuthPermission[];
};

export type RolesListResponse = PaginatedResponse<Role>;
export type PermissionsListResponse = PaginatedResponse<Permission>;
export type PermissionCategoriesListResponse = PaginatedResponse<PermissionCategory>;
export type RoleDetailResponse = DetailResponse<Role>;
export type CreateRoleResponse = DetailResponse<CreatedRole>;
export type PermissionDetailResponse = DetailResponse<Permission>;
export type PermissionCategoryDetailResponse = DetailResponse<PermissionCategory>;

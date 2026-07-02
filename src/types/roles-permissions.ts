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
  permission_category_id: string | number | null;
  dashboard_permissions: boolean;
  created_at: string;
  updated_at: string;
};

export type Role = {
  id: string;
  name: string;
  allowed_user: boolean;
  permissions?: Permission[];
};

export type PermissionCategory = {
  id: string;
  name: string;
  name_ar: string | null;
  name_en: string | null;
  slug: string;
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

export type RolesListResponse = PaginatedResponse<Role>;
export type PermissionsListResponse = PaginatedResponse<Permission>;
export type PermissionCategoriesListResponse = PaginatedResponse<PermissionCategory>;
export type RoleDetailResponse = DetailResponse<Role>;
export type PermissionDetailResponse = DetailResponse<Permission>;
export type PermissionCategoryDetailResponse = DetailResponse<PermissionCategory>;

export type UserRole = "user" | "root" | "merchant" | "driver";

export type UserListItem = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  active: boolean;
  role: UserRole | null;
  mobile_verified: boolean;
  mobile_verified_at: string | null;
  created_at: string;
};

export type UsersPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type UsersListResponse = {
  error: boolean;
  message: string;
  data: UserListItem[];
  meta: UsersPaginationMeta;
};

export type UsersQueryParams = {
  page: number;
  limit: number;
  role?: UserRole;
  order_by?: "asc" | "desc";
  search?: string;
};

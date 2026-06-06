export type UserRole = "user" | "root" | "merchant" | "driver" | "rider";
export type UserKycStatus = "not_verified" | "pending" | "approved";

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

export type UserCity = {
  id: string;
  name: string;
};

export type UserLocation = {
  latitude: number;
  longitude: number;
};

export type UserBankAccount = {
  bank_name: string;
  account_number: string;
  iban: string;
};

export type AdminUserDetail = UserListItem & {
  kyc_status: UserKycStatus;
  wallet_balance: number;
  is_subscribed: boolean;
  city: UserCity | null;
  location: UserLocation | null;
  bank_account: UserBankAccount | null;
  addresses_count: number;
  kycs_count: number;
  subscriptions_count: number;
};

export type AdminUserDetailResponse = {
  error: boolean;
  message: string;
  data: AdminUserDetail;
};

export type UsersQueryParams = {
  page: number;
  limit: number;
  role?: UserRole;
  order_by?: "asc" | "desc";
  search?: string;
};

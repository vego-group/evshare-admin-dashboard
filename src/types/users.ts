export type UserRole = string;
export type UserKycStatus = "not_verified" | "pending" | "approved";
export type UserAccountStatus = "active" | "suspended" | "deleted";

export type UserListItem = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  active: boolean;
  account_status: UserAccountStatus;
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

export type UserSubscription = {
  start_date: string;
  end_date: string;
};

export type AdminUserDetail = UserListItem & {
  role_id?: string | null;
  first_name: string | null;
  last_name: string | null;
  language: "ar" | "en";
  notifications_enabled: boolean;
  deleted_at: string | null;
  kyc_status: UserKycStatus;
  wallet_balance: number;
  currency?: string;
  wallet_currency?: string;
  is_subscribed: boolean;
  subscription: UserSubscription | null;
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
  account_status?: UserAccountStatus;
  order_by?: "asc" | "desc";
  search?: string;
};

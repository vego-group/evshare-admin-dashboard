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
  status?: UserAccountStatus;
  role: UserRole | null;
  verification_status?: "verified" | "unverified";
  subscription_status?: UserSubscriptionStatus | null;
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

export type UserSubscriptionStatus = "subscribed" | "unsubscribed";

export type UserRoleSummary = {
  id: string;
  key: string;
  name: string;
};

export type UserRoleDistribution = UserRoleSummary & {
  count: number;
  percentage: number;
};

export type UsersStatisticsResponse = {
  error: boolean;
  message: string;
  data: {
    statistics: {
      total_users: { count: number };
      active_users: { count: number; percentage: number };
      suspended_users: { count: number; percentage: number };
      unverified_users: { count: number };
      new_users_this_month: { count: number };
    };
    role_distribution: {
      total_users: number;
      roles: UserRoleDistribution[];
    };
    roles: UserRoleSummary[];
  };
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
  per_page?: number;
  /** Kept for consumers that still use the legacy API contract. */
  limit?: number;
  role?: UserRole;
  status?: UserAccountStatus;
  /** Kept for consumers that still use the legacy API contract. */
  account_status?: UserAccountStatus;
  subscription_status?: UserSubscriptionStatus;
  sort_by?: "created_at";
  sort_order?: "asc" | "desc";
  /** Kept for consumers that still use the legacy API contract. */
  order_by?: "asc" | "desc";
  search?: string;
};

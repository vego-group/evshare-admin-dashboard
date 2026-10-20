export type UserRole = string;
export type UserKycStatus = "not_verified" | "pending" | "approved";
export type UserAccountStatus = "active" | "suspended" | "deleted";
export type UserVerificationStatus = "verified" | "unverified";

export type UserListItem = {
  id: string;
  name: string;
  /**
   * Deleted accounts normally expose the original number from
   * `deleted_mobile`. Older removals whose number cannot be recovered return
   * null, so list and detail consumers must tolerate that state.
   */
  mobile: string | null;
  email: string | null;
  active: boolean;
  account_status: UserAccountStatus;
  status?: UserAccountStatus;
  role: UserRole | null;
  verification_status?: UserVerificationStatus;
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

/** Status values returned by the users list filters and rows. */
export type UserSubscriptionStatus = "subscribed" | "unsubscribed";

/** Derived status returned by GET /users/{uuid}. */
export type UserDetailSubscriptionStatus = "active" | "expired" | "unsubscribed";

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
  start_date: string | null;
  end_date: string | null;
};

export type UserSubscriptionSummary = {
  subscription_status: UserDetailSubscriptionStatus;
  is_subscribed: boolean;
  subscription_id: string | null;
  activated_at: string | null;
  initial_duration_months: number | null;
  bonus_months: number;
  bonus_orders_count: number;
  reversed_bonus_orders_count: number;
  bonus_months_per_order: number;
  is_bonus_enrolled: boolean;
  base_ends_at: string | null;
  ends_at: string | null;
  days_remaining: number | null;
};

export type UserSubscriptionExtensionOrder = {
  id: string;
  code: string;
  status: string;
};

export type UserSubscriptionExtensionReversal = {
  id: string;
  reason: "refunded" | "cancelled";
  months: number;
  previous_ends_at: string;
  new_ends_at: string;
  created_at: string;
};

export type UserSubscriptionExtension = {
  id: string;
  subscription_id: string;
  order: UserSubscriptionExtensionOrder | null;
  months: number;
  previous_ends_at: string;
  new_ends_at: string;
  is_reversed: boolean;
  reversed_at: string | null;
  reversal: UserSubscriptionExtensionReversal | null;
  created_at: string;
};

export type AdminUserDetail = Omit<UserListItem, "subscription_status"> & {
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
  /** Optional during the October 2026 backend rollout. */
  subscription_status?: UserDetailSubscriptionStatus;
  /** Optional during the October 2026 backend rollout. */
  subscription_summary?: UserSubscriptionSummary | null;
  /** Optional during the October 2026 backend rollout. */
  subscription_extensions?: UserSubscriptionExtension[];
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
  verification_status?: UserVerificationStatus;
  subscription_status?: UserSubscriptionStatus;
  sort_by?: "created_at";
  sort_order?: "asc" | "desc";
  /** Kept for consumers that still use the legacy API contract. */
  order_by?: "asc" | "desc";
  search?: string;
};

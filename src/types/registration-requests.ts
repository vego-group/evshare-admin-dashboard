export type {
  RegistrationRequest,
  RegistrationRequestStatus,
} from "@/data/registration-requests";

export type KycStatus = "pending" | "rejected" | "approved";
export type OrderBy = "asc" | "desc";
export type KycOrderBy = OrderBy;

export type KycsQueryParams = {
  page: number;
  limit: number;
  status?: KycStatus;
  order_by?: OrderBy;
  search?: string;
};

export type KycCity = {
  id: string;
  name: string;
};

export type KycListItem = {
  id: string;
  name: string;
  status: KycStatus;
  city: KycCity | null;
  created_at: string;
  updated_at: string;
};

export type KycUser = {
  id: string;
  name: string;
  mobile: number | string;
  role: string;
  has_rated?: boolean;
  is_mobile_verified?: boolean;
  is_subscribed?: boolean;
  language?: string;
  notifications_enabled?: boolean;
};

export type KycDetail = KycListItem & {
  user: KycUser;
};

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type KycAnalytics = {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
};

export type KycsListResponse = {
  error: boolean;
  message: string;
  data: KycListItem[];
  meta: PaginationMeta;
  analytics: KycAnalytics;
};

export type KycDetailResponse = {
  error: boolean;
  message: string;
  data: KycDetail;
};

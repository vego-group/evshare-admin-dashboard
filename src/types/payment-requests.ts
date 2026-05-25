import { OrderBy, RequestStatus } from ".";

export type {
  RegistrationRequest,
  RegistrationRequestStatus,
} from "@/data/registration-requests";

export type PaymentRequestsQueryParams = {
  page: number;
  limit: number;
  status?: RequestStatus;
  order_by?: OrderBy;
  search?: string;
};

export type PaymentRequest = {
  id: string;
  status: RequestStatus;
};

export type PaymentRequestsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PaymentRequestsAnalytics = {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
};

export type PaymentRequestsListResponse = {
  error: boolean;
  message: string;
  data: PaymentRequest[];
  meta: PaymentRequestsPaginationMeta;
  analytics: PaymentRequestsAnalytics;
};

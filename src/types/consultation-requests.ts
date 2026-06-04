import type { OrderBy, PaginationMeta } from ".";

export type ConsultationRequestType = "مبيعات" | "تقني" | "دعم" | "عام";

export type ConsultationRequestStatus = "جديد" | "مغلق" | "تم التواصل";

export type ConsultationRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: ConsultationRequestType;
  status: ConsultationRequestStatus;
  date: string;
};


export type ConsultationStatus = "pending" | "reviewed" | "closed";

export type ConsultationsQueryParams = {
  page: number;
  limit: number;
  status?: ConsultationStatus;
  order_by?: OrderBy;
  search?: string;
};

export type ConsultationUser = {
  id: string;
  name: string;
  role: string | null;
} | null;

export type ConsultationListItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  details: string;
  status: ConsultationStatus;
  user: ConsultationUser;
  created_at: string;
};

export type ConsultationAnalytics = {
  total: number;
  pending: number;
  reviewed: number;
  closed: number;
};

export type ConsultationListResponse = {
  error: boolean;
  message: string;
  data: ConsultationListItem[];
  meta: PaginationMeta;
  analytics: ConsultationAnalytics;
};

export type ConsultationDetailResponse = {
  error: boolean;
  message: string;
  data: ConsultationListItem;
};

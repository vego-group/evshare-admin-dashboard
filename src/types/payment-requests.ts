import React from "react";
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
  amount: string;
  status: RequestStatus;
  created_at: string;
  user: {
    id: string;
    name: string;
    mobile: string;
  };
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

export type BankAccount = {
  id: string;
  bank_name: string;
  iban: string;
  name: string;
  id_number: string;
};

export type PaymentRequestUser = {
  id: string;
  name: string;
  mobile: string;
  role: string;
  is_subscribed: boolean;
  language: string;
  notifications_enabled: boolean;
  has_rated: boolean;
  is_mobile_verified: boolean;
  bank_account: BankAccount;
};

export type PaymentRequestDetail = {
  id: string;
  amount: string;
  status: RequestStatus;
  notes: string;
  user: PaymentRequestUser;
  bank_account: BankAccount;
  created_at: string;
};

export type PaymentRequestDetailResponse = {
  error: boolean;
  message: string;
  data: PaymentRequestDetail;
};

export type PaymentRequestStatCard = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
};

import type React from "react";
import type { ComponentType } from "react";
import { OrderBy } from ".";

export type ComplaintStatus = "new" | "in_progress" | "answered";

export type ComplaintsQueryParams = {
  page: number;
  limit: number;
  status?: ComplaintStatus;
  order_by?: OrderBy;
};

export type ComplaintUser = {
  id: string;
  name: string;
  role: string;
};

export type Complaint = {
  id: string;
  complaint_number: string;
  title?: string;
  message: string;
  status: ComplaintStatus;
  admin_response: string | null;
  user: ComplaintUser;
  responder: ComplaintUser | null;
  created_at: string;
};

export type ComplaintsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type ComplaintsAnalytics = {
  total: number;
  new: number;
  in_progress: number;
  answered: number;
};

export type ComplaintsListResponse = {
  error: boolean;
  message: string;
  data: Complaint[];
  meta: ComplaintsPaginationMeta;
  analytics?: ComplaintsAnalytics;
};

export type ComplaintDetailResponse = {
  error: boolean;
  message: string;
  data: Complaint;
};

export type ComplaintStatCard = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
};

export type ComplaintStatConfig = {
  label: string;
  key: keyof ComplaintsAnalytics;
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
};

export type AnswerComplaintPayload = {
  response: string;
};

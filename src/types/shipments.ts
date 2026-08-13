import type { OrderBy } from ".";

export type ShipmentStatus =
  | "pending"
  | "action_required"
  | "created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "failed_attempt"
  | "delivered"
  | "returned"
  | "cancelled"
  | "lost";

export type ShipmentDirection = "forward" | "reverse";

export type ShipmentPickingType = "PICKUP_BY_DC" | "BRANCH_DROP_OFF";

export type ShipmentHistorySource = "manual" | "webhook" | "poll";

export type ShipmentsQueryParams = {
  page: number;
  limit: number;
  search?: string;
  status?: ShipmentStatus;
  direction?: ShipmentDirection;
  shipping_company_uuid?: string;
  order_uuid?: string;
  order_by?: OrderBy;
};

export type ShipmentLocationCity = {
  id: string;
  name: string;
  name_en: string;
  name_ar: string;
};

export type ShipmentLocation = {
  id: string;
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  label: string;
  city: ShipmentLocationCity | null;
} | null;

export type ShipmentSender = {
  name: string | null;
  mobile: string | null;
  email: string | null;
  location: ShipmentLocation;
};

export type ShipmentRecipient = ShipmentSender & {
  district: string | null;
  postcode: string | null;
  short_address_code: string | null;
};

export type ShipmentOrderSummary = {
  id: string;
  order_code: string;
  status: string;
  total: number;
  customer_name: string | null;
};

export type ShipmentCompanySummary = {
  id: string;
  name: string;
  code: string;
  shipping_id: string | null;
  active: boolean;
};

export type ShipmentPackage = {
  count: number;
  weight: number | string | null;
  width: number | string | null;
  length: number | string | null;
  height: number | string | null;
};

export type ShipmentDriver = {
  name: string | null;
  phone: string | null;
  email: string | null;
};

export type ShipmentListItem = {
  id: string;
  tracking_id: string | null;
  shipping_id: string | null;
  dc_tracking_number: string | null;
  delivery_option_id: string | null;
  direction: ShipmentDirection;
  status: ShipmentStatus;
  status_label: string;
  is_cancellable: boolean;
  picking_type: ShipmentPickingType | null;
  order: ShipmentOrderSummary | null;
  shipping_company: ShipmentCompanySummary | null;
  sender: ShipmentSender;
  recipient: ShipmentRecipient;
  price: number | string | null;
  cod_amount: number | string | null;
  declared_value: number | string | null;
  currency: string;
  package: ShipmentPackage;
  tracking_url: string | null;
  branded_tracking_url: string | null;
  awb_url: string | null;
  driver: ShipmentDriver;
  estimated_pickup_date: string | null;
  estimated_delivery_date: string | null;
  shipped_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  notes: string | null;
  failure_reason: string | null;
  attempts_count: number;
  created_at: string;
};

export type ShipmentHistoryUser = {
  id: string;
  name: string;
};

export type ShipmentHistory = {
  id: string;
  status: ShipmentStatus;
  status_label: string;
  oto_status: string | null;
  dc_status: string | null;
  description: string | null;
  source: ShipmentHistorySource;
  current_city: string | null;
  current_country: string | null;
  current_district: string | null;
  current_branch: string | null;
  user: ShipmentHistoryUser | null;
  occurred_at: string;
};

export type ShipmentDetail = ShipmentListItem & {
  histories: ShipmentHistory[];
};

export type ShipmentsAnalytics = {
  total: number;
  pending: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
};

export type ShipmentsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type ShipmentsListResponse = {
  error: boolean;
  message: string;
  data: ShipmentListItem[];
  meta: ShipmentsPaginationMeta;
  analytics: ShipmentsAnalytics;
};

export type OrderShipmentsListResponse = {
  error: boolean;
  message: string;
  data: ShipmentListItem[];
  meta: ShipmentsPaginationMeta;
};

export type ShipmentDetailsResponse = {
  error: boolean;
  message: string;
  data: ShipmentDetail;
};

export type ShipmentPayload = {
  shipping_company_uuid?: string | null;
  delivery_option_id?: string | null;
  tracking_id?: string | null;
  shipping_id?: string | null;
  picking_type?: ShipmentPickingType | null;
  price?: number | null;
  cod_amount?: number | null;
  declared_value?: number | null;
  currency?: string | null;
  package_count?: number | null;
  package_weight?: number | null;
  box_width?: number | null;
  box_length?: number | null;
  box_height?: number | null;
  tracking_url?: string | null;
  awb_url?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  estimated_pickup_date?: string | null;
  estimated_delivery_date?: string | null;
  notes?: string | null;
};

export type ShipmentStatusPayload = {
  status: ShipmentStatus;
  description?: string | null;
};

export type ShipmentCancelPayload = {
  reason?: string | null;
};

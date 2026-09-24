import type { OrderBy } from ".";
import type { ProductImage } from "./products";
import type { VehicleStatus } from "./vehicle-operating-pricing";

export type OrderStatusCategory = "new" | "completed" | "cancelled";
export type OrderNewStatus =
  | "draft"
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "completed"
  | "cancelled";

type BaseOrderQueryParams = {
  page: string;
  limit: string;
  status_category?: Exclude<OrderStatusCategory, "new">;
  order_by?: OrderBy;
  search?: string;
};

type NewOrderQueryParams = {
  page: string;
  limit: string;
  status_category: "new";
  status?: OrderNewStatus;
  order_by?: OrderBy;
  search?: string;
};

export type OrderQueryParams = BaseOrderQueryParams | NewOrderQueryParams;

export type OrderUser = {
  id: string;
  name: string;
  bank_account: string | null;
  role: string | null;
};

export type OrderAddress = {
  id: string;
  name: string;
  category: string;
  building_number: string;
  building_name: string;
  street_name: string;
  national_address: string;
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_mobile: string;
  latitude: string;
  longitude: string;
  address: string;
  is_default: boolean;
  created_at: string;
} | null;

export type OrderProduct = {
  id: string;
  title: string;
  description: string;
  small_description: string | null;
  price: string;
  quantity: number;
  monthly_subscription_price: string | null;
  open_price: string | null;
  default_image: ProductImage | null;
  is_favorite: boolean;
};

export type OrderItemVehicle = {
  id: string;
  label: string | null;
  status: VehicleStatus;
};

export type OrderItem = {
  product: OrderProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
  vehicles: OrderItemVehicle[];
};

export type OrderDiscount = {
  applied: boolean;
  type: "promo_code" | "automatic" | null;
  code: string | null;
  amount: number;
};

export type OrderDetail = {
  id: string;
  currency?: string;
  order_code: string;
  subtotal: number;
  vat_percentage: number;
  vat_amount: number;
  delivery_fee: number;
  total: number;
  total_before_discount: number;
  discount: OrderDiscount;
  total_after_discount: number;
  paid_amount: number;
  /** Backwards-compatible aliases returned by the API. */
  discount_amount: number;
  final_total: number;
  status: OrderNewStatus;
  status_category: OrderStatusCategory;
  is_draft: boolean;
  notes: string | null;
  user: OrderUser | null;
  address: OrderAddress;
  items: OrderItem[];
  receipt?: OrderReceipt | null;
  operating_type?: "evshare" | "operation_company";
  requires_delivery_address: boolean;
  operation_company_id?: string | number | null;
  operation_company?: { id: string; name: string } | null;
  products_count: number;
  created_at: string;
};

export type OrderListItem = Omit<OrderDetail, "items">;

export type OrdersPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type OrdersAnalytics = {
  total: number;
  new: number;
  completed: number;
  cancelled: number;
};

export type OrdersListResponse = {
  error: boolean;
  message: string;
  data: OrderListItem[];
  meta: OrdersPaginationMeta;
  analytics: OrdersAnalytics;
};

export type OrderDetailResponse = {
  error: boolean;
  message: string;
  data: OrderDetail;
};

export type OrderReceiptStatus =
  | "pending_signature"
  | "pending_admin_approval"
  | "approved"
  | "rejected";

export type OrderRefundStatus =
  | "not_applicable"
  | "pending"
  | "resolved"
  | "requested"
  | "processing"
  | "pending_provider"
  | "completed"
  | "failed"
  | "timed_out"
  | "reconciliation_required"
  | "cancelled";
export type OrderRefundMethod = "wallet" | "contact";

export type OrderReceiptVehicle = {
  id: string;
  label: string | null;
};

export type OrderReceiptItem = {
  id: string;
  vehicle: OrderReceiptVehicle;
  received: boolean;
  issue_description: string | null;
  refund_status: OrderRefundStatus;
  refund_method: OrderRefundMethod | null;
  refund_notes: string | null;
  refund_amount: number | null;
  refund_resolved_at: string | null;
  /** Financial values and references are supplied by the backend when available. */
  total_paid?: number | null;
  refunded_amount?: number | null;
  pending_refund_amount?: number | null;
  refundable_amount?: number | null;
  remaining_refundable_amount?: number | null;
  refund_currency?: string | null;
  refund_id?: string | null;
  provider_refund_id?: string | null;
  correlation_id?: string | null;
  can_refund?: boolean;
};

export type OrderReceiptAttachment = ProductImage;

export type OrderReceipt = {
  id: string;
  status: OrderReceiptStatus;
  rejection_reason: string | null;
  items?: OrderReceiptItem[] | null;
  attachments?: OrderReceiptAttachment[] | null;
  pdf_link: string;
  created_at: string;
};

export type OrderReceiptResponse = {
  error: boolean;
  message: string;
  data: OrderReceipt;
};

export type ContractAttachment = {
  url: string;
  file_name: string;
  type: string;
};

export type OrderOperatingContract = {
  id: string;
  status: "pending_signature" | "pending_admin_review" | "approved" | "rejected";
  rejection_reason: string | null;
  signed_at: string | null;
  operation_company: { id: string; name: string };
  original_contract: ContractAttachment | null;
  signed_contract: ContractAttachment | null;
  created_at: string;
};

export type OrderOperatingContractResponse = {
  error: boolean;
  message: string;
  data: OrderOperatingContract | null;
};

export type ReviewOrderOperatingContractPayload =
  | { status: "approved"; rejection_reason?: never }
  | { status: "rejected"; rejection_reason: string };

export type ReviewOrderReceiptPayload =
  | { status: "approved"; rejection_reason?: undefined }
  | { status: "rejected"; rejection_reason: string };

export type ResolveOrderRefundPayload =
  | { method: "wallet"; amount: number; notes: string; currency?: string }
  | { method: "contact"; amount?: undefined; notes: string; currency?: string };

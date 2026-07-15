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

export type OrderDetail = {
  id: string;
  order_code: string;
  subtotal: number;
  vat_percentage: number;
  vat_amount: number;
  delivery_fee: number;
  total: number;
  status: OrderNewStatus;
  status_category: OrderStatusCategory;
  is_draft: boolean;
  notes: string | null;
  user: OrderUser;
  address: OrderAddress;
  items: OrderItem[];
  receipt?: OrderReceipt | null;
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

export type OrderRefundStatus = "not_applicable" | "pending" | "resolved";
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

export type ReviewOrderReceiptPayload =
  | { status: "approved"; rejection_reason?: undefined }
  | { status: "rejected"; rejection_reason: string };

export type ResolveOrderRefundPayload =
  | { method: "wallet"; amount: number; notes?: string }
  | { method: "contact"; amount?: undefined; notes?: string };

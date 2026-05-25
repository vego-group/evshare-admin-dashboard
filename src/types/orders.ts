import type { OrderBy } from ".";

export type OrderStatusCategory = "new" | "completed" | "cancelled";
export type OrderNewStatus =
  | "draft"
  | "pending"
  | "preparing"
  | "ready"
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
  default_image: string | null;
  is_favorite: boolean;
};

export type OrderItem = {
  product: OrderProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
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

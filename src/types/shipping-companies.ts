import type { OrderBy, Status } from ".";

export type ShippingServiceType =
  | "express"
  | "sameDay"
  | "pudo"
  | "lockerDelivery"
  | "coldDelivery"
  | "heavyAndBulky";

export type ShippingDeliveryType =
  | "toCustomerDoorstep"
  | "pickupByCustomer"
  | "locker";

export type ShippingCompaniesQueryParams = {
  page: number;
  limit: number;
  search?: string;
  status?: Status;
  order_by?: OrderBy;
};

export type ShippingCompanyListItem = {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  code: string;
  shipping_id: string | null;
  service_type: ShippingServiceType | null;
  delivery_type: ShippingDeliveryType | null;
  logo_url: string | null;
  avg_delivery_time: string | null;
  base_price: number | string | null;
  cod_charge: number | string | null;
  return_fee: number | string | null;
  max_free_weight: number | string | null;
  extra_weight_per_kg: number | string | null;
  max_order_value: number | string | null;
  max_cod_value: number | string | null;
  supports_cod: boolean;
  active: boolean;
  sort_order: number;
  shipments_count: number;
  created_at: string;
};

export type ShippingCompaniesAnalytics = {
  total: number;
  active: number;
  inactive: number;
};

export type ShippingCompaniesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type ShippingCompaniesListResponse = {
  error: boolean;
  message: string;
  data: ShippingCompanyListItem[];
  meta: ShippingCompaniesPaginationMeta;
  analytics: ShippingCompaniesAnalytics;
};

export type ShippingCompanyDetailsResponse = {
  error: boolean;
  message: string;
  data: ShippingCompanyListItem;
};

export type ShippingCompanyPayload = {
  name_ar?: string;
  name_en?: string;
  code?: string;
  shipping_id?: string | null;
  service_type?: ShippingServiceType | null;
  delivery_type?: ShippingDeliveryType | null;
  logo_url?: string | null;
  avg_delivery_time?: string | null;
  base_price?: number | null;
  cod_charge?: number | null;
  return_fee?: number | null;
  max_free_weight?: number | null;
  extra_weight_per_kg?: number | null;
  max_order_value?: number | null;
  max_cod_value?: number | null;
  supports_cod?: boolean;
  active?: boolean;
  sort_order?: number;
};

import type { QueryParams } from ".";

export type VehicleOperatingType = "evshare" | "operation_company";
export type VehicleActivationStatus =
  | "draft"
  | "pending_contract_upload"
  | "pending_admin_approval"
  | "contract_rejected"
  | "working";
export type VehicleStatus =
  | "new"
  | "active"
  | "disabled"
  | "maintenance"
  | "suspended"
  | "in_use";

export type VehiclesQueryParams = Omit<QueryParams, "status"> & {
  status?: VehicleStatus;
  activation_status?: VehicleActivationStatus;
  operating_type?: VehicleOperatingType;
};

export type OperationCompany = {
  id: string;
  operation_company_id: number;
  name_ar: string;
  name_en: string;
  name: string;
  commission_percentage?: number | string | null;
  pricing_percentage?: number | string | null;
  slug?: string;
  mobile?: string;
  email?: string;
  created_at?: string;
};

export type VehicleContract = {
  id: string;
  status: VehicleActivationStatus;
  rejection_reason: string | null;
  attachments: Array<{ url?: string; name?: string; file_name?: string } | string>;
  created_at: string;
};

export type VehiclePricing = {
  open_price: number | string | null;
  price_per_minute: number | string | null;
  price_per_km: number | string | null;
  price_per_hour: number | string | null;
  price_per_day: number | string | null;
};

export type VehicleListItem = VehiclePricing & {
  id: string;
  label?: string | null;
  status: VehicleStatus;
  activation_status: VehicleActivationStatus;
  operating_type: VehicleOperatingType;
  user_id?: number | null;
  order_item_id?: number | null;
  operation_company: OperationCompany | null;
  vehicle_contract: VehicleContract | null;
  location?: unknown;
  zone?: unknown;
  created_at: string;
};

export type VehiclesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type VehiclesListResponse = {
  error: boolean;
  message: string;
  data: VehicleListItem[];
  meta?: VehiclesPaginationMeta;
};

export type VehicleDetailsResponse = {
  error: boolean;
  message: string;
  data: VehicleListItem;
};

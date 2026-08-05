import type { ProductListItem } from "./products";
import type { QueryParams } from ".";

export type VehicleOperatingType = "evshare" | "operation_company";
export type VehicleStatus =
  | "new"
  | "active"
  | "disabled"
  | "maintenance"
  | "suspended"
  | "in_use";

export type VehicleLockStatus = "locked" | "unlocked";

export type VehiclesQueryParams = Omit<QueryParams, "status"> & {
  status?: VehicleStatus;
  operating_type?: VehicleOperatingType;
  operation_company_uuid?: string;
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

export type VehicleLocation = {
  id: string;
  longitude: string;
  latitude: string;
  address?: string;
  label?: string;
  created_at?: string;
};

export type VehiclePricing = {
  open_price: number | string | null;
  price_per_minute: number | string | null;
  price_per_km: number | string | null;
  price_per_hour: number | string | null;
  price_per_day: number | string | null;
};

export type VehicleZoneType = "normal" | "slow" | "restricted";

export type VehicleZone = {
  id: string;
  name_ar: string;
  name_en: string;
  type: VehicleZoneType;
  speed_limit: number | null;
  coordinates: string;
  is_active: boolean;
};

export type VehicleListItem = VehiclePricing & {
  id: string;
  label?: string | null;
  status: VehicleStatus;
  operating_type: VehicleOperatingType;
  user_id?: number | null;
  order_item_id?: number | null;
  operation_company: OperationCompany | null;
  location?: VehicleLocation | null;
  zones: VehicleZone[];
  iot_device_id: string | null;
  battery_percentage: number | null;
  product: ProductListItem | null;
  lock?: VehicleLock | null;
  updated_at: string;
  created_at: string;
};

export type VehiclesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type VehiclesAnalysis = {
  total: number;
  active: number;
  in_use: number;
  maintenance: number;
  stopped: number;
};

export type VehiclesListResponse = {
  error: boolean;
  message: string;
  data: VehicleListItem[];
  meta?: VehiclesPaginationMeta;
  analysis?: VehiclesAnalysis;
};

export type VehicleDetailsResponse = {
  error: boolean;
  message: string;
  data: VehicleListItem;
};

export type VehicleLock = {
  id: string;
  device_id: string;
  status: VehicleLockStatus;
  notes: string | null;
  last_lock_date: string | null;
  last_unlock_date: string | null;
  vehicle: VehicleListItem | null;
  created_at: string;
  updated_at: string;
};

export type VehicleLocksQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: VehicleLockStatus;
  assigned?: boolean;
  vehicle_uuid?: string;
};

export type VehicleLocksPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type VehicleLocksListResponse = {
  error: boolean;
  message: string;
  data: VehicleLock[];
  meta?: VehicleLocksPaginationMeta;
};

export type VehicleLockDetailsResponse = {
  error: boolean;
  message: string;
  data: VehicleLock;
};

export type CreateVehicleLockPayload = {
  device_id: string;
  vehicle_uuid?: string;
  notes?: string;
};

export type UpdateVehicleLockPayload = Partial<{
  device_id: string;
  vehicle_uuid: string | null;
  notes: string | null;
}>;

export type AssignVehicleLockPayload = {
  vehicle_uuid: string;
};

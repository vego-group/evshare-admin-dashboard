import type { VehicleListItem } from "./vehicle-operating-pricing";
import type { QueryParams } from ".";

export type TripStatus = "started" | "in_progress" | "completed" | "cancelled";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type RoutePoint = Coordinate & {
  label?: string;
  timestamp?: string;
};

export type TripDateTime = {
  start: string;
  end: string | null;
};

export type TripTimelineEvent = {
  event: string;
  timestamp: string;
};

export type TripPricingSnapshot = {
  currency: string;
  unlock_fee: number | string | null;
  price_per_minute: number | string | null;
  billing_increment_seconds: number | null;
  minimum_charge: number | string | null;
  balance_before: number | string | null;
  pricing_locked_at: string | null;
};

export type TripCostBreakdown = {
  unlock_fee: number | string | null;
  time_cost: number | string | null;
  other_charges: number | string | null;
  vat_amount: number | string | null;
  total: number | string | null;
};

export type TripCancellation = {
  unlock_fee_refunded: boolean;
  refund_amount?: number | string | null;
  reason?: string | null;
};

export type TripDriver = {
  id: string;
  name?: string;
  mobile?: string;
  email?: string;
  avatar?: string | null;
};

export type TripVehicle = Pick<
  VehicleListItem,
  "id" | "label" | "status" | "product" | "iot_device_id" | "battery_percentage"
>;

export type TripListItem = {
  id: string;
  status: TripStatus;
  price: number | string | null;
  vehicle_type: "bike" | "scooter";
  remaining_balance?: number | string | null;
  auto_stopped_at: string | null;
  auto_stop_attempts: number;
  auto_stop_last_attempt_at: string | null;
  auto_stop_last_error: string | null;
  pickup_location: Coordinate;
  drop_off_location: Coordinate | null;
  live_location: Coordinate | null;
  route: RoutePoint[];
  date_time: TripDateTime;
  timeline: TripTimelineEvent[];
  currency?: string;
  open_price?: number | string | null;
  price_per_minute?: number | string | null;
  billing_increment_seconds?: number | null;
  minimum_charge?: number | string | null;
  balance_before?: number | string | null;
  pricing_locked_at?: string | null;
  pricing?: Partial<TripPricingSnapshot> | null;
  cost_breakdown?: Partial<TripCostBreakdown> | null;
  cancellation?: TripCancellation | null;
  driver: TripDriver;
  vehicle: TripVehicle;
  created_at?: string;
};

export type TripDetail = TripListItem;

export type TripsQueryParams = Omit<QueryParams, "status"> & {
  status?: TripStatus;
};

export type TripsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type TripsListResponse = {
  error: boolean;
  message: string;
  data: TripListItem[];
  meta: TripsPaginationMeta;
};

export type TripDetailsResponse = {
  error: boolean;
  message: string;
  data: TripDetail;
};

export type TripMutationResponse = TripDetailsResponse;

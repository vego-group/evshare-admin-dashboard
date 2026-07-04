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
  pickup_location: Coordinate;
  drop_off_location: Coordinate | null;
  live_location: Coordinate | null;
  route: RoutePoint[];
  date_time: TripDateTime;
  timeline: TripTimelineEvent[];
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

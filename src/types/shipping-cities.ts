import type { Status } from ".";

export type ShippingCitiesQueryParams = {
  page: number;
  limit: number;
  search?: string;
  status?: Status;
  country_code?: string;
  city_uuid?: string;
};

export type ShippingCityCity = {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  active: boolean;
};

export type ShippingCityListItem = {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  oto_name: string | null;
  country_code: string;
  city: ShippingCityCity | null;
  courier_delivery: boolean;
  bullet_delivery: boolean;
  branch_coverage: boolean;
  active: boolean;
  synced_at: string | null;
  created_at: string;
};

export type ShippingCitiesAnalytics = {
  total: number;
  active: number;
  mapped: number;
  unmapped: number;
};

export type ShippingCitiesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type ShippingCitiesListResponse = {
  error: boolean;
  message: string;
  data: ShippingCityListItem[];
  meta: ShippingCitiesPaginationMeta;
  analytics: ShippingCitiesAnalytics;
};

export type ShippingCityDetailsResponse = {
  error: boolean;
  message: string;
  data: ShippingCityListItem;
};

export type ShippingCityPayload = {
  name_ar?: string;
  name_en?: string;
  oto_name?: string | null;
  country_code?: string;
  city_uuid?: string | null;
  courier_delivery?: boolean;
  bullet_delivery?: boolean;
  branch_coverage?: boolean;
  active?: boolean;
};

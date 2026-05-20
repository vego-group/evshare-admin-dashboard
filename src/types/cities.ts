export type CityListItem = {
  id: string;
  name_ar: string;
  name_en: string;
  name: string;
  active: boolean;
  created_at: string;
};

export type CitiesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type CitiesAnalytics = {
  total_cities: number;
  active_cities: number;
  inactive_cities: number;
  most_used_city: string | null;
};

export type CitiesListResponse = {
  error: boolean;
  message: string;
  data: CityListItem[];
  meta: CitiesPaginationMeta;
  analytics: CitiesAnalytics;
};

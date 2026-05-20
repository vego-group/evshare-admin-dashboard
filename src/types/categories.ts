import { OrderBy } from ".";

export type CategoryStatus = "active" | "inactive";

export type CategoriesQueryParams = {
  page: number;
  limit: number;
  status?: CategoryStatus;
  order_by?: OrderBy;
  search?: string;
};

export type CategoryImage = {
  url: string;
  type: string;
  document_type: string | null;
  disk: string;
  created_at: string;
};

export type CategoryListItem = {
  id: string;
  name_ar: string;
  name_en: string;
  name: string;
  active: boolean;
  products_count?: number;
  image: CategoryImage | null;
  created_at: string;
};

export type CategoryDetail = CategoryListItem & {
  products_count: number;
};

export type CategoriesAnalytics = {
  total_categories: number;
  active_categories: number;
  inactive_categories: number;
  most_used_category: string | null;
};

export type CategoriesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type CategoriesListResponse = {
  error: boolean;
  message: string;
  data: CategoryListItem[];
  meta: CategoriesPaginationMeta;
  analytics: CategoriesAnalytics;
};

export type CategoryDetailResponse = {
  error: boolean;
  message: string;
  data: CategoryDetail;
};

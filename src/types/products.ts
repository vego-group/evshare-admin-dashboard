import { QueryParams } from ".";

export type ProductsQueryParams = QueryParams & {
  category_id?: number;
};

export type ProductImage = {
  url: string;
  type: string;
  document_type: string | null;
  disk: string;
  created_at: string;
};

export type ProductCategory = {
  id: string;
  name_ar: string;
  name_en: string;
  name: string;
  active: boolean;
  created_at: string;
};

export type ProductListItem = {
  id: string;
  title_ar: string;
  title_en: string;
  title: string;
  description_ar: string;
  description_en: string;
  description: string;
  small_description_ar: string;
  small_description_en: string;
  small_description: string;
  price: string;
  quantity: number;
  monthly_subscription_price: string;
  open_price: string;
  active: boolean;
  default_image: ProductImage | null;
  category: ProductCategory | null;
  created_at: string;
};

export type ProductsAnalytics = {
  total_products: number;
  active_products: number;
  inactive_products: number;
  working_rate: number;
};

export type ProductsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type ProductsListResponse = {
  error: boolean;
  message: string;
  data: ProductListItem[];
  meta: ProductsPaginationMeta;
  analytics: ProductsAnalytics;
};

export type ProductFeature = {
  id: string;
  title_ar: string;
  title_en: string;
  title: string;
};

export type ProductDetail = ProductListItem & {
  features: ProductFeature[];
  images: ProductImage[];
};

export type ProductDetailsResponse = {
  error: boolean;
  message: string;
  data: ProductDetail;
};

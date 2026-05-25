export type SliderImage = {
  url: string;
  type: string;
  document_type: string | null;
  disk: string;
  created_at: string;
};

export type Slider = {
  id: string;
  active: boolean;
  image: SliderImage;
  created_at: string;
  updated_at: string;
};

export type SlidersPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type SlidersAnalytics = {
  total_slides: number;
  active_slides: number;
  inactive_slides: number;
  total_views: number;
};

export type SlidersListResponse = {
  error: boolean;
  message: string;
  data: Slider[];
  meta: SlidersPaginationMeta;
  analytics: SlidersAnalytics;
};


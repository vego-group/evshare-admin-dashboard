export type FeatureFlagsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type FeatureFlag = {
  id: string;
  uuid?: string;
  key: string;
  name: string;
  name_ar: string;
  name_en: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FeatureFlagsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type FeatureFlagsListResponse = {
  error: boolean;
  message: string;
  data: FeatureFlag[];
  meta: FeatureFlagsPaginationMeta;
};

export type FeatureFlagDetailsResponse = {
  error: boolean;
  message: string;
  data: FeatureFlag;
};

export type CreateFeatureFlagPayload = {
  key: string;
  name_ar: string;
  name_en: string;
  is_active: boolean;
};

export type UpdateFeatureFlagPayload = Partial<{
  name_ar: string;
  name_en: string;
  is_active: boolean;
}>;

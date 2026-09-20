export type FeatureFlagsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  is_enabled?: boolean;
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

/**
 * The browser receives evaluated booleans only. Targeting rules and audience
 * attributes stay on the server and must never be included in this response.
 */
export type EvaluatedFeatureFlags = Record<string, boolean>;

export type FeatureFlagEvaluation = {
  application: "admin";
  platform: "web";
  application_version: string;
  tenant: string;
  configuration_version: string;
  published_at: string;
  evaluated_at: string;
  expires_at: string;
  flags: EvaluatedFeatureFlags;
};

export type FeatureFlagEvaluationResponse = {
  error: boolean;
  message: string;
  data: FeatureFlagEvaluation;
};

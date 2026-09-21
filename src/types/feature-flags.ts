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
  is_active?: boolean;
  default_value?: boolean;
  audience?: "admin" | "rider" | "merchant" | "backend" | "all";
  platforms?: string[] | null;
  min_app_version?: number | null;
  max_app_version?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  version?: number;
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
  default_value?: boolean;
  audience?: "admin" | "rider" | "merchant" | "backend" | "all";
  platforms?: Array<"android" | "ios" | "web"> | null;
  min_app_version?: number | null;
  max_app_version?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
};

export type UpdateFeatureFlagPayload = Partial<{
  key: string;
  name_ar: string;
  name_en: string;
  is_active: boolean;
  default_value: boolean;
  audience: "admin" | "rider" | "merchant" | "backend" | "all";
  platforms: Array<"android" | "ios" | "web"> | null;
  min_app_version: number | null;
  max_app_version: number | null;
  starts_at: string | null;
  ends_at: string | null;
}>;

export type FeatureFlagVersion = Omit<FeatureFlag, "is_enabled"> & {
  version: number;
  is_active: boolean;
  restored_from_version?: number | null;
};

export type FeatureFlagVersionsResponse = {
  error: boolean;
  message: string;
  data: FeatureFlagVersion[];
};

/**
 * The browser receives evaluated booleans only. Targeting rules and audience
 * attributes stay on the server and must never be included in this response.
 */
export type EvaluatedFeatureFlag = {
  id: string;
  key: string;
  name: string;
  name_ar: string;
  name_en: string;
  is_enabled: boolean;
  enabled: boolean;
};

export type FeatureFlagEvaluation = {
  feature_flags: EvaluatedFeatureFlag[];
  flags: Record<string, boolean>;
  config_version: number;
  config_published_at: string | null;
  evaluated_at: string;
  evaluation_context: {
    audience: "admin";
    platform: "web";
    version_code: number;
  };
};

export type FeatureFlagEvaluationResponse = {
  error: boolean;
  message: string;
  data: FeatureFlagEvaluation;
};

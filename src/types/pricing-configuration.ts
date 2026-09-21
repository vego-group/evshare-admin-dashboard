export type PricingPropagationStatus =
  | "pending"
  | "propagating"
  | "propagated"
  | "failed"
  | "stale";

/**
 * Metadata returned by pricing APIs when configuration versioning is enabled.
 * Every field is optional so the admin remains compatible while the backend is
 * rolled out service by service.
 */
export type PricingConfigurationMetadata = {
  configuration_version?: string | number | null;
  version?: string | number | null;
  tenant?: string | null;
  effective_at?: string | null;
  expires_at?: string | null;
  propagation_status?: PricingPropagationStatus | null;
  propagated_at?: string | null;
  propagation_lag_ms?: number | null;
  updated_at?: string | null;
  updated_by?: string | null;
};

export type PricingConfigurationState = {
  config_version: number;
  checksum: string;
  published_at: string;
  propagation_sla_seconds: number;
  active_versions: Record<string, string>;
  precedence: string[];
};

export type PricingConfigurationStateResponse = {
  error: boolean;
  message?: string;
  data: PricingConfigurationState;
};

export type PricingSettingVersion = {
  uuid: string;
  setting_name: string;
  value: string;
  effective_from: string;
  effective_until: string | null;
  is_active: boolean;
  config_version?: number;
  created_at?: string;
};

export type PricingSettingHistoryResponse = {
  error: boolean;
  message?: string;
  data: PricingSettingVersion[];
};

export type SchedulePricingPayload = {
  setting_name: string;
  value: string;
  effective_from?: string;
  effective_until?: string;
};

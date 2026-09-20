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

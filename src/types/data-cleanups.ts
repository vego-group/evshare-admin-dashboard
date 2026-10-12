export type DataCleanupModuleKey =
  | "orders"
  | "registration_requests"
  | "consultation_requests"
  | "withdrawal_requests"
  | "complaints"
  | "payment_operations";

export type DataCleanupModeKey = "all" | "before_date" | "keep_latest";
export type DataCleanupStatus =
  | "previewed"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export type DataCleanupMode = {
  key: DataCleanupModeKey;
  name_en: string;
  name_ar: string;
  requires_cutoff: boolean;
};

export type DataCleanupRule = {
  module: DataCleanupModuleKey;
  mode: DataCleanupModeKey;
  cutoff: string | null;
};

export type DataCleanupModule = {
  key: DataCleanupModuleKey;
  name_en: string;
  name_ar: string;
  modes: DataCleanupMode[];
  default: { mode: DataCleanupModeKey; cutoff: string | null };
  tables: Array<{
    table: string;
    total: number;
    oldest_created_at: string | null;
    newest_created_at: string | null;
  }>;
};

export type DataCleanupModulesResponse = {
  error: boolean;
  message: string;
  data: {
    tenant: string;
    timezone: string;
    today: string;
    confirmation_phrase: string;
    preview_ttl_minutes: number;
    order_payments: Array<"keep" | "delete">;
    modules: DataCleanupModule[];
  };
};

export type DataCleanupPlanItem = {
  table: string;
  total: number;
  to_delete: number;
  to_keep: number;
  dependents: Record<string, number> | [];
  dangling_kept: Record<string, number> | [];
  notes: Record<string, string | number | boolean | null> | [];
  transactions?: {
    table: string;
    total: number;
    to_delete: number;
    to_keep: number;
  };
};

export type DataCleanupRun = {
  id: string;
  tenant: string;
  status: DataCleanupStatus;
  can_execute: boolean;
  modules: DataCleanupRule[];
  order_payments: "keep" | "delete";
  frozen_at: string;
  plan: Partial<Record<DataCleanupModuleKey, DataCleanupPlanItem>>;
  backup: null | {
    file_name?: string;
    bytes?: number;
    tables?: string[];
    external_snapshot?: string;
  };
  result: Record<string, Record<string, number>> | [] | null;
  validation: null | {
    passed: boolean;
    checks: Record<string, boolean>;
    info: Record<string, number> | [];
  };
  after: Partial<Record<DataCleanupModuleKey, DataCleanupPlanItem>> | [] | null;
  error: string | null;
  previewed_by: { id: string; name: string } | null;
  executed_by: { id: string; name: string } | null;
  expires_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type DataCleanupRunResponse = {
  error: boolean;
  message: string;
  data: DataCleanupRun;
};

export type DataCleanupHistoryResponse = {
  error: boolean;
  message: string;
  data: DataCleanupRun[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};

export type DataCleanupPreviewPayload = {
  modules: DataCleanupRule[];
  order_payments: "keep" | "delete";
};

export type DataCleanupExecutePayload = {
  confirmation: string;
  backup_reference?: string;
};

export type DataCleanupErrorBody = {
  message?: string;
  error_code?: string;
  errors?: Record<string, string[]>;
  data?: {
    previewed?: Record<string, number>;
    current?: Record<string, number>;
  } | [];
};

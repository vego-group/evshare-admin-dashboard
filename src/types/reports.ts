export type ReportFilterDefinition = {
  required?: boolean;
  rules?: string[];
  options?: string[] | Record<string, string>;
};

export type ReportDefinition = {
  key: string;
  version: string;
  title: string;
  description: string;
  owner: string;
  permission: string;
  grouping: string;
  rules: Record<string, string>;
  filters: Record<string, ReportFilterDefinition>;
  columns: Record<string, string>;
  format: string;
};

export type ReportExportStatus = "queued" | "processing" | "completed" | "failed" | "expired";

export type ReportExport = {
  id: string;
  type: string;
  definition_version: string;
  status: ReportExportStatus;
  progress: number | null;
  row_count: number | null;
  processed_rows: number | null;
  filters: Record<string, string>;
  totals: Record<string, number> | null;
  columns: Record<string, string> | null;
  file_name: string | null;
  error: string | null;
  download_url: string | null;
  requested_at: string;
  expires_at: string | null;
};

export type ReportCatalogResponse = { data: ReportDefinition[] } | ReportDefinition[];
export type ReportExportResponse = { data: ReportExport } | ReportExport;
export type ReportExportsResponse = { data: ReportExport[] } | ReportExport[];

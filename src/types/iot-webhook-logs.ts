export type IotWebhookJson = Record<string, unknown>;

export type IotWebhookNormalized = IotWebhookJson & {
  kind?: string | null;
  device_id?: string | null;
  lat?: number | null;
  lng?: number | null;
  battery?: number | null;
  is_locked?: boolean | null;
  timestamp?: string | null;
  command?: unknown;
};

export type IotWebhookLog = {
  id: string;
  tenant: string | null;
  device_id: string | null;
  kind: string | null;
  handled: boolean;
  reason: string | null;
  normalized: IotWebhookNormalized | null;
  payload: IotWebhookJson | null;
  context: IotWebhookJson | null;
  created_at: string;
  updated_at: string;
};

export type IotWebhookLogsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type IotWebhookLogsQueryParams = {
  page: number;
  device_id?: string;
  kind?: string;
  tenant?: string;
  handled?: boolean;
  search?: string;
};

export type IotWebhookLogsListResponse = {
  error: boolean;
  message: string;
  data: IotWebhookLog[];
  meta: IotWebhookLogsPaginationMeta;
};

export type IotWebhookLogDetailResponse = {
  error: boolean;
  message: string;
  data: IotWebhookLog;
};

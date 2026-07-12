export type WebhookGateway = "myfatoorah" | "moyasar" | "tamara" | (string & {});

export type WebhookLogsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type WebhookLogsQueryParams = {
  page: number;
  gateway?: WebhookGateway;
  is_processed?: boolean;
};

export type WebhookLog = {
  id: string;
  payment_gateway: WebhookGateway;
  is_processed: boolean;
  request_body: Record<string, unknown> | null;
  request_header: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type WebhookLogsListResponse = {
  error: boolean;
  message: string;
  data: WebhookLog[];
  meta: WebhookLogsPaginationMeta;
};

export type WebhookLogDetailResponse = {
  error: boolean;
  message: string;
  data: WebhookLog;
};

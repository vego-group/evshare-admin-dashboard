export type CommunicationChannel = "push" | "sms";
export type CommunicationTargetApp = "merchant" | "rider";
export type CommunicationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "partially_completed"
  | "failed";

export type CommunicationQueryParams = {
  page: number;
  per_page: number;
  status?: CommunicationStatus;
  channel?: CommunicationChannel;
  target_app?: CommunicationTargetApp;
  search?: string;
  sort_order?: "asc" | "desc";
};

export type CommunicationAuthor = { id: string; name: string };

export type CommunicationListItem = {
  id: string;
  title: string | null;
  channels: CommunicationChannel[];
  target_apps: CommunicationTargetApp[];
  status: CommunicationStatus;
  created_by: CommunicationAuthor;
  created_at: string;
  sent_at: string | null;
};

export type CommunicationAudience = {
  total_users: number;
  merchant_users: number;
  rider_users: number;
};

export type CommunicationChannelDelivery = {
  targeted: number;
  sent: number;
  failed: number;
  skipped: number;
};

export type CommunicationDetails = CommunicationListItem & {
  notification_body: string | null;
  sms_body: string | null;
  delivery: {
    audience: CommunicationAudience | null;
    push: CommunicationChannelDelivery | null;
    sms: CommunicationChannelDelivery | null;
  };
  started_at: string | null;
};

export type CommunicationPayload = {
  title?: string;
  notification_body?: string;
  sms_body?: string;
  channels: CommunicationChannel[];
  target_apps: CommunicationTargetApp[];
};

export type CommunicationsListResponse = {
  error: boolean;
  message: string;
  data: CommunicationListItem[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
};

export type CommunicationDetailsResponse = {
  error: boolean;
  message: string;
  data: CommunicationDetails;
};

export type SendCommunicationResponse = CommunicationDetailsResponse & {
  replayed: boolean;
};

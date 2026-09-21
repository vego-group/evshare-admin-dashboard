export const contentPublicationStatuses = [
  "draft",
  "archived",
  "scheduled",
  "publishing",
  "published",
  "failed",
  "rolled_back",
] as const;

export const contentAudiences = ["rider", "merchant", "all"] as const;
export const contentLocales = ["ar", "en"] as const;

export type ContentPublicationStatus =
  (typeof contentPublicationStatuses)[number];
export type ContentAudience = (typeof contentAudiences)[number];
export type ContentLocale = (typeof contentLocales)[number];

export type ContentConsumerStatus = {
  status: "pending" | "current" | "stale" | "failed";
  version?: string | number | null;
  refreshed_at?: string | null;
  error?: string | null;
};

export type ContentPublication = {
  status: ContentPublicationStatus;
  audience?: ContentAudience;
  audiences?: ContentAudience[];
  tenant?: string;
  locales?: ContentLocale[];
  effective_at?: string | null;
  version: string | number;
  published_at?: string | null;
  propagated_at?: string | null;
  error?: string | null;
  consumers?: Partial<Record<ContentAudience, ContentConsumerStatus>>;
  expires_at?: string | null;
  published_by?: { id: string; name?: string } | null;
  config_version?: string | number | null;
};

export type PublishContentPayload = {
  status?: "published" | "draft" | "archived";
  audience?: ContentAudience;
  published_at?: string;
  expires_at?: string | null;
};

export type ContentPublicationVersion = ContentPublication & {
  content?: Record<string, unknown>;
  restored_from_version?: number | null;
};

export type ContentPublicationVersionsResponse = {
  error: boolean;
  message: string;
  data: ContentPublicationVersion[];
};

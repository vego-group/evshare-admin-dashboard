export const contentPublicationStatuses = [
  "draft",
  "scheduled",
  "publishing",
  "published",
  "failed",
  "rolled_back",
] as const;

export const contentAudiences = ["rider", "merchant"] as const;
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
  audiences: ContentAudience[];
  tenant: string;
  locales: ContentLocale[];
  effective_at: string | null;
  version: string | number;
  published_at?: string | null;
  propagated_at?: string | null;
  error?: string | null;
  consumers?: Partial<Record<ContentAudience, ContentConsumerStatus>>;
};

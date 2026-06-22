export const appVersionPlatforms = ["android", "ios"] as const;
export const appVersionStatuses = ["draft", "active", "archived"] as const;

export type AppVersionPlatform = (typeof appVersionPlatforms)[number];
export type AppVersionStatus = (typeof appVersionStatuses)[number];

export type AppVersionsQueryParams = {
  limit?: number;
  platform?: AppVersionPlatform;
  status?: AppVersionStatus;
};

export type AppVersionReleaseNotes = {
  en: string | null;
  ar: string | null;
};

export type AppVersionCreatedBy = {
  id: string;
  name: string;
  mobile: string;
  avatar: string;
};

export type AppVersionListItem = {
  id: string;
  platform: AppVersionPlatform;
  version: string;
  version_code: number;
  is_critical: boolean;
  release_notes?: AppVersionReleaseNotes | null;
  status: AppVersionStatus;
  created_at: string;
  created_by?: AppVersionCreatedBy | null;
};

export type AppVersionDetail = Omit<
  AppVersionListItem,
  "created_by" | "release_notes"
> & {
  release_notes: AppVersionReleaseNotes;
};

export type AppVersionsListResponse = {
  error: boolean;
  message: string;
  data: AppVersionListItem[];
};

export type AppVersionDetailResponse = {
  error: boolean;
  message: string;
  data: AppVersionDetail;
};

export type AppVersionPayload = {
  platform: AppVersionPlatform;
  version: string;
  version_code: number;
  is_critical: boolean;
  status: AppVersionStatus;
  release_notes_en?: string;
  release_notes_ar?: string;
};

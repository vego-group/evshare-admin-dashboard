export const appVersionPlatforms = ["android", "ios"] as const;
export const appVersionStatuses = ["draft", "active", "archived"] as const;
export const appVersionTypes = ["merchant", "driver"] as const;

export type AppVersionPlatform = (typeof appVersionPlatforms)[number];
export type AppVersionStatus = (typeof appVersionStatuses)[number];
export type AppVersionType = (typeof appVersionTypes)[number];

export type AppVersionsQueryParams = {
  limit?: number;
  platform?: AppVersionPlatform;
  status?: AppVersionStatus;
  type?: AppVersionType;
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
  type: AppVersionType;
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

export type AppVersionLatestValues = {
  version: string;
  version_code: number;
};

export type AppVersionLatestValuesResponse = {
  error: boolean;
  message: string;
  data: AppVersionLatestValues;
};

export type AppVersionPayload = {
  type: AppVersionType;
  platform: AppVersionPlatform;
  version: string;
  version_code: number;
  is_critical: boolean;
  status: AppVersionStatus;
  release_notes_en?: string;
  release_notes_ar?: string;
};

export type WebsiteLocale = "ar" | "en";
export type WebsitePageSlug =
  | "home"
  | "about"
  | "contact"
  | "privacy-policy"
  | "terms-of-service";

export type WebsiteAdmin = { id: string; name: string };
export type WebsiteContent = Record<string, unknown>;

export type WebsiteSection = {
  id: string;
  key: string;
  contentAr: WebsiteContent;
  contentEn: WebsiteContent;
  settings: WebsiteContent;
  sortOrder: number;
  isVisible: boolean;
  updatedAt?: string;
};

export type WebsiteSeo = {
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
};

export type WebsitePageSummary = {
  id: string;
  slug: WebsitePageSlug;
  status: "published" | "draft";
  isActive: boolean;
  isLive: boolean;
  version: number;
  publishedVersion?: number | null;
  hasUnpublishedChanges: boolean;
  publishedAt?: string | null;
  updatedAt?: string;
  updatedBy?: WebsiteAdmin | null;
  publishedBy?: WebsiteAdmin | null;
  seo: WebsiteSeo;
  sectionsCount: number;
};

export type WebsitePageDetail = WebsitePageSummary & {
  sections: WebsiteSection[];
  published: {
    version: number;
    publishedAt: string;
    seo: WebsiteSeo;
    sections: WebsiteSection[];
  } | null;
};

export type WebsiteSettingGroup = {
  key: string;
  contentAr: WebsiteContent;
  contentEn: WebsiteContent;
  settings: WebsiteContent;
  version: number;
  updatedBy?: WebsiteAdmin | null;
  updatedAt?: string;
};

export type WebsiteMedia = {
  id: string;
  url: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  inUse: boolean;
  inPublishedUse: boolean;
  usage: { draft: string[]; published: string[]; settings: string[] };
  uploadedBy?: WebsiteAdmin | null;
  createdAt: string;
};

export type WebsiteAuditLog = {
  id: string;
  action: string;
  entityType: "page" | "section" | "settings" | "media";
  pageSlug?: string | null;
  sectionKey?: string | null;
  previousValue?: unknown;
  newValue?: unknown;
  admin?: WebsiteAdmin | null;
  ipAddress?: string | null;
  createdAt: string;
};

export type WebsitePagination = {
  currentPage?: number;
  lastPage?: number;
  perPage?: number;
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
};

export type WebsiteListResponse<T> = { data: T[]; meta?: WebsitePagination };
export type WebsiteItemResponse<T> = { data: T };

export type WebsiteApiError = {
  error?: boolean;
  error_code?: string;
  message?: string;
  errors?: Record<string, string[]>;
  details?: { currentVersion?: number; usage?: WebsiteMedia["usage"] };
};

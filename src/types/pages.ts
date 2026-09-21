export type Page = {
  uuid: string;
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  created_at: string;
  updated_at: string;
};

export type PagesQueryParams = {
  limit?: number;
};

export type PagesListResponse = {
  error: boolean;
  message: string;
  data: Page[];
};

export type PageDetailResponse = {
  error: boolean;
  message: string;
  data: Page;
};

export type UpdatePagePayload = Partial<{
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
}>;

import { buildQuery } from "@/lib/utils/build-query";
import type {
  WebsiteAuditLog,
  WebsiteItemResponse,
  WebsiteListResponse,
  WebsiteMedia,
  WebsitePageDetail,
  WebsitePageSummary,
  WebsiteSettingGroup,
} from "@/types";
import { baseAPI } from "..";

export const websitePagesAPI = async (): Promise<WebsiteListResponse<WebsitePageSummary>> =>
  baseAPI("GET", "/website/pages");

export const websitePageAPI = async (slug: string): Promise<WebsiteItemResponse<WebsitePageDetail>> =>
  baseAPI("GET", `/website/pages/${encodeURIComponent(slug)}`);

export const websitePreviewAPI = async (slug: string, locale: string) =>
  baseAPI("GET", `/website/pages/${encodeURIComponent(slug)}/preview?locale=${encodeURIComponent(locale)}`);

export const websiteSettingsAPI = async (): Promise<WebsiteListResponse<WebsiteSettingGroup>> =>
  baseAPI("GET", "/website/settings");

export const websiteMediaAPI = async (params: {
  search?: string;
  mime_type?: string;
  page?: number;
  per_page?: number;
}): Promise<WebsiteListResponse<WebsiteMedia>> =>
  baseAPI("GET", `/website/media?${buildQuery({
    search: params.search,
    mime_type: params.mime_type,
    page: params.page?.toString(),
    per_page: params.per_page?.toString(),
  })}`);

export const websiteAuditLogsAPI = async (params: {
  page_slug?: string;
  section_key?: string;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}): Promise<WebsiteListResponse<WebsiteAuditLog>> =>
  baseAPI("GET", `/website/audit-logs?${buildQuery({
    ...params,
    page: params.page?.toString(),
    per_page: params.per_page?.toString(),
  })}`);

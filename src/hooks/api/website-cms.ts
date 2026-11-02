import {
  websiteAuditLogsAPI,
  websiteMediaAPI,
  websitePageAPI,
  websitePagesAPI,
  websiteSettingsAPI,
} from "@/services/queries";
import { useCustomQuery } from "..";

export const useWebsitePages = () => useCustomQuery(["website", "pages"], websitePagesAPI);

export const useWebsitePage = (slug: string) =>
  useCustomQuery(["website", "pages", slug], () => websitePageAPI(slug), { enabled: Boolean(slug) });

export const useWebsiteSettings = () =>
  useCustomQuery(["website", "settings"], websiteSettingsAPI);

export const useWebsiteMedia = (params: Parameters<typeof websiteMediaAPI>[0]) =>
  useCustomQuery(["website", "media", params], () => websiteMediaAPI(params));

export const useWebsiteAuditLogs = (params: Parameters<typeof websiteAuditLogsAPI>[0]) =>
  useCustomQuery(["website", "audit-logs", params], () => websiteAuditLogsAPI(params));

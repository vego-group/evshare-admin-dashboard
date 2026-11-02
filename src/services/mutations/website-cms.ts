"use server";

import type {
  WebsiteApiError,
  WebsiteItemResponse,
  WebsiteMedia,
  WebsitePageDetail,
  WebsiteSettingGroup,
} from "@/types";
import { safeApi } from "..";

const pageUrl = (slug: string) => `/website/pages/${encodeURIComponent(slug)}`;

export const updateWebsitePageAPI = async (slug: string, payload: Record<string, unknown>) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>("PUT", pageUrl(slug), payload);

export const updateWebsiteSectionAPI = async (slug: string, key: string, payload: Record<string, unknown>) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>(
    "PUT",
    `${pageUrl(slug)}/sections/${encodeURIComponent(key)}`,
    payload,
  );

export const addWebsiteSectionAPI = async (slug: string, payload: Record<string, unknown>) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>("POST", `${pageUrl(slug)}/sections`, payload);

export const reorderWebsiteSectionsAPI = async (slug: string, payload: Record<string, unknown>) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>("PATCH", `${pageUrl(slug)}/sections/reorder`, payload);

export const setWebsiteSectionVisibilityAPI = async (slug: string, key: string, payload: Record<string, unknown>) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>(
    "PATCH",
    `${pageUrl(slug)}/sections/${encodeURIComponent(key)}/visibility`,
    payload,
  );

export const deleteWebsiteSectionAPI = async (slug: string, key: string, version: number) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>(
    "DELETE",
    `${pageUrl(slug)}/sections/${encodeURIComponent(key)}?version=${version}`,
  );

export const publishWebsitePageAPI = async (slug: string, version: number) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>("POST", `${pageUrl(slug)}/publish`, { version });

export const unpublishWebsitePageAPI = async (slug: string, version: number) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>("POST", `${pageUrl(slug)}/unpublish`, { version });

export const discardWebsiteDraftAPI = async (slug: string, version: number) =>
  await safeApi<WebsiteItemResponse<WebsitePageDetail>, WebsiteApiError>("POST", `${pageUrl(slug)}/discard-draft`, { version });

export const updateWebsiteSettingsAPI = async (groups: Record<string, unknown>) =>
  await safeApi<WebsiteItemResponse<WebsiteSettingGroup[]>, WebsiteApiError>("PUT", "/website/settings", { groups });

export const uploadWebsiteMediaAPI = async (formData: FormData) =>
  await safeApi<WebsiteItemResponse<WebsiteMedia>, WebsiteApiError>("POST", "/website/media", formData, { isForm: true });

export const deleteWebsiteMediaAPI = async (id: string) =>
  await safeApi<unknown, WebsiteApiError>("DELETE", `/website/media/${encodeURIComponent(id)}`);

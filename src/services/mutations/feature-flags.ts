"use server";

import type {
  CreateFeatureFlagPayload,
  FeatureFlagDetailsResponse,
  UpdateFeatureFlagPayload,
} from "@/types";

import { safeApi } from "..";

export const addFeatureFlag = async (payload: CreateFeatureFlagPayload) =>
  await safeApi<FeatureFlagDetailsResponse>("POST", "/feature-flags", payload);

export const editFeatureFlag = async (
  featureFlagId: string,
  payload: UpdateFeatureFlagPayload,
) =>
  await safeApi<FeatureFlagDetailsResponse>(
    "POST",
    `/feature-flags/${featureFlagId}/edit`,
    payload,
  );

export const deleteFeatureFlag = async (featureFlagId: string) =>
  await safeApi("DELETE", `/feature-flags/${featureFlagId}`);

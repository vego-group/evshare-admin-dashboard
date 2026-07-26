"use server";

import type {
  AddTestAccountPayload,
  EditTestAccountPayload,
  TestAccountDetailResponse,
} from "@/types";

import { safeApi } from "..";

export const addTestAccount = async (payload: AddTestAccountPayload) =>
  await safeApi<TestAccountDetailResponse>("POST", "/test-accounts/add", payload);

export const editTestAccount = async (
  testAccountId: string,
  payload: EditTestAccountPayload,
) =>
  await safeApi<TestAccountDetailResponse>(
    "POST",
    `/test-accounts/${testAccountId}/edit`,
    payload,
  );

export const enableTestAccount = async (testAccountId: string) =>
  await safeApi<TestAccountDetailResponse>(
    "POST",
    `/test-accounts/${testAccountId}/enable`,
  );

export const disableTestAccount = async (testAccountId: string) =>
  await safeApi<TestAccountDetailResponse>(
    "POST",
    `/test-accounts/${testAccountId}/disable`,
  );

export const deleteTestAccount = async (testAccountId: string) =>
  await safeApi("DELETE", `/test-accounts/${testAccountId}/delete`);

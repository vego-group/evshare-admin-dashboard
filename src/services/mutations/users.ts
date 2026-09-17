"use server";

import { safeApi } from "..";
import type { AdminUserDetailResponse } from "@/types";

type UserMutationError = { message: string; errors?: Record<string, string[]>; error_code?: string };

export type EditUserPayload = Partial<{
  first_name: string;
  last_name: string;
  email: string | null;
  city_id: string | null;
  role: string;
  active: boolean;
  language: "ar" | "en";
  notifications_enabled: boolean;
}>;

type AddUserPayload = {
  first_name: string;
  last_name: string;
  mobile: string;
  role: string;
  email?: string;
};

export const addUser = async (payload: AddUserPayload) =>
  await safeApi("POST", "/users/add", payload);

export const editUser = async (id: string, payload: EditUserPayload) =>
  safeApi<AdminUserDetailResponse, UserMutationError>("POST", `/users/${id}/edit`, payload);

export const suspendUser = async (id: string, reason?: string) =>
  safeApi<AdminUserDetailResponse, UserMutationError>("POST", `/users/${id}/suspend`, reason ? { reason } : {});

export const reactivateUser = async (id: string) =>
  safeApi<AdminUserDetailResponse, UserMutationError>("POST", `/users/${id}/reactivate`);

export const removeUser = async (id: string, reason: string) =>
  safeApi<AdminUserDetailResponse, UserMutationError>("DELETE", `/users/${id}/delete`, { reason });

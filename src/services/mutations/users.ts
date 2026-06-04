"use server";

import { safeApi } from "..";
import type { UserRole } from "@/types";

type AddUserPayload = {
  first_name: string;
  last_name: string;
  mobile: string;
  role: UserRole;
  email?: string;
};

export const addUser = async (payload: AddUserPayload) =>
  await safeApi("POST", "/users/add", payload);

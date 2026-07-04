"use server";

import { safeApi } from "..";

type AddUserPayload = {
  first_name: string;
  last_name: string;
  mobile: string;
  role: string;
  email?: string;
};

export const addUser = async (payload: AddUserPayload) =>
  await safeApi("POST", "/users/add", payload);

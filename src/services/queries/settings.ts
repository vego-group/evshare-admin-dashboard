import type { SettingsListResponse } from "@/types";
import { baseAPI } from "..";

export const settingsAPI = async (): Promise<SettingsListResponse> =>
  await baseAPI("GET", "/settings");

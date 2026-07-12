import { settingsAPI } from "@/services/queries";

import { useCustomQuery } from "..";

export function useSettings() {
  return useCustomQuery(["settings"], async () => settingsAPI());
}

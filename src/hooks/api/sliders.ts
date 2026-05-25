import { QueryParams } from "@/types";
import { useCustomQuery } from "..";
import { slidersAPI } from "@/services/queries";

export function useSliders(params: QueryParams) {
  return useCustomQuery(["sliders", params], async () => slidersAPI(params));
}

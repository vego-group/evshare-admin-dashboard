import { QueryParams } from "@/types";
import { useCustomQuery } from "..";
import { citiesAPI } from "@/services/queries";

export function useCities(params: QueryParams) {
  return useCustomQuery(["cities", params], async () => citiesAPI(params));
}

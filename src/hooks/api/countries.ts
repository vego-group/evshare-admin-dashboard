import { useCustomQuery } from "..";
import { countriesAPI } from "@/services/queries";

export function useCountries() {
  return useCustomQuery(["countries"], countriesAPI, { staleTime: 300_000 });
}

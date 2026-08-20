import type { CountriesResponse } from "@/types";

export async function countriesAPI(): Promise<CountriesResponse> {
  const response = await fetch("/api/countries", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || "تعذر تحميل الدول");
  return data;
}

import type { CountriesResponse } from "@/types";

export async function countriesAPI(): Promise<CountriesResponse> {
  const response = await fetch("/api/countries", { cache: "no-store" });
  if (!response.ok) throw new Error("تعذر تحميل قائمة الدول");
  const payload = await response.json();
  const countries = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.data?.countries)
      ? payload.data.countries
      : Array.isArray(payload.countries)
        ? payload.countries
        : [];
  return { ...payload, data: countries };
}

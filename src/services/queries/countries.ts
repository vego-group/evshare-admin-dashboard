import type { CountriesResponse, Country } from "@/types";

function isCountry(value: unknown): value is Country {
  if (!value || typeof value !== "object") return false;

  const country = value as Partial<Country>;
  return (
    typeof country.code === "string" &&
    typeof country.name_ar === "string" &&
    typeof country.name_en === "string" &&
    typeof country.active === "boolean" &&
    typeof country.currency_code === "string"
  );
}

export function normalizeCountriesResponse(payload: unknown): CountriesResponse {
  const response = payload && typeof payload === "object"
    ? payload as Partial<CountriesResponse>
    : {};

  return {
    error: response.error === true,
    message: typeof response.message === "string" ? response.message : "",
    data: Array.isArray(response.data) ? response.data.filter(isCountry) : [],
  };
}

export async function countriesAPI(): Promise<CountriesResponse> {
  const response = await fetch("/api/countries", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data: unknown = await response.json();
  if (!response.ok) {
    const message = data && typeof data === "object" && "message" in data
      ? String(data.message)
      : "تعذر تحميل الدول";
    throw new Error(message);
  }
  return normalizeCountriesResponse(data);
}

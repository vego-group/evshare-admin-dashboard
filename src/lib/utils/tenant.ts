"use server";

import { cookies } from "next/headers";
import { countryCodeSchema } from "@/schemas/countries";
import type { CountryCode } from "@/types";

const TENANT_COOKIE = "tenant_id";

export async function getTenant(): Promise<CountryCode> {
  const value = (await cookies()).get(TENANT_COOKIE)?.value;
  return countryCodeSchema.safeParse(value).data ?? "sa";
}

export async function setTenant(value: CountryCode) {
  const tenant = countryCodeSchema.parse(value);
  (await cookies()).set(TENANT_COOKIE, tenant, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

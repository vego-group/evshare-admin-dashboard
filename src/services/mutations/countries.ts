"use server";

import { removeToken, setCountry } from "@/lib";

export async function selectCountryAPI(country: string) {
  await setCountry(country);
  await removeToken();
}

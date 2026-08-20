import { z } from "zod";

export const countryCodeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z]{2}$/, "يرجى اختيار دولة صحيحة");

export const countrySelectionSchema = z.object({
  country: countryCodeSchema,
});

export type CountrySelectionValues = z.infer<typeof countrySelectionSchema>;

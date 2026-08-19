import { z } from "zod";
import { countryCodes } from "@/types/countries";

export const countryCodeSchema = z.enum(countryCodes);

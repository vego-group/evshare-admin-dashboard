import type { FieldErrors, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

import {
  shipmentAddSchema,
  shipmentSchema,
  type ShipmentFormValues,
} from "@/schemas/shipments";
import { normalizeTenantPhone, PHONE_VALIDATION_MESSAGE } from "@/lib/utils/tenant-phone";

export const shipmentDefaultValues: ShipmentFormValues = {
  order_uuid: "",
  shipping_company_uuid: "",
  delivery_option_id: "",
  tracking_id: "",
  shipping_id: "",
  picking_type: "PICKUP_BY_DC",
  price: undefined,
  cod_amount: undefined,
  declared_value: undefined,
  currency: "SAR",
  package_count: undefined,
  package_weight: undefined,
  box_width: undefined,
  box_length: undefined,
  box_height: undefined,
  tracking_url: "",
  awb_url: "",
  driver_name: "",
  driver_phone: "",
  estimated_pickup_date: "",
  estimated_delivery_date: "",
  notes: "",
};

const buildResolver =
  (schema: ZodType, countryCode: string, unchangedPhone?: string | null): Resolver<ShipmentFormValues> =>
  async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      const phone = (result.data as ShipmentFormValues).driver_phone;
      if (phone && phone !== unchangedPhone && !normalizeTenantPhone(phone, countryCode)) {
        return { values: {}, errors: { driver_phone: { type: "validate", message: PHONE_VALIDATION_MESSAGE } } };
      }
      return { values: result.data as ShipmentFormValues, errors: {} };
    }

    const errors: FieldErrors<ShipmentFormValues> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ShipmentFormValues | undefined;
      if (field && !errors[field]) {
        errors[field] = { type: issue.code, message: issue.message };
      }
    }

    return { values: {}, errors };
  };

export const shipmentAddResolver = (countryCode: string) => buildResolver(shipmentAddSchema, countryCode);
export const shipmentEditResolver = (countryCode: string, unchangedPhone?: string | null) => buildResolver(shipmentSchema, countryCode, unchangedPhone);

import type { FieldErrors, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

import {
  shipmentAddSchema,
  shipmentSchema,
  type ShipmentFormValues,
} from "@/schemas/shipments";
import { normalizeTenantPhone, PHONE_VALIDATION_MESSAGE } from "@/lib/utils/tenant-phone";

export const getShipmentDefaultValues = (currency = ""): ShipmentFormValues => ({
  order_uuid: "",
  shipping_company_uuid: "",
  delivery_option_id: "",
  tracking_id: "",
  shipping_id: "",
  picking_type: "PICKUP_BY_DC",
  price: undefined,
  cod_amount: undefined,
  declared_value: undefined,
  currency,
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
  sender_name: "",
  sender_mobile: "",
  sender_email: "",
  sender_address: "",
  sender_latitude: undefined,
  sender_longitude: undefined,
  sender_city_uuid: "",
  recipient_name: "",
  recipient_mobile: "",
  recipient_email: "",
  recipient_address: "",
  recipient_district: "",
  recipient_postcode: "",
  recipient_short_address_code: "",
  recipient_latitude: undefined,
  recipient_longitude: undefined,
  recipient_city_uuid: "",
  notes: "",
});

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

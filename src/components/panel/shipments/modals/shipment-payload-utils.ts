import type { ShipmentFormValues } from "@/schemas/shipments";
import type { ShipmentListItem, ShipmentPayload } from "@/types";
import { normalizeTenantPhone } from "@/lib/utils/tenant-phone";

/** Fields the API accepts on `POST /shipments/{uuid}/edit`. */
const editableFields = [
  "shipping_company_uuid",
  "delivery_option_id",
  "tracking_id",
  "shipping_id",
  "picking_type",
  "price",
  "cod_amount",
  "package_count",
  "package_weight",
  "box_width",
  "box_length",
  "box_height",
  "tracking_url",
  "awb_url",
  "driver_name",
  "driver_phone",
  "estimated_pickup_date",
  "estimated_delivery_date",
  "notes",
] as const;

const toNumber = (value: number | string | null | undefined) =>
  value === null || value === undefined || value === ""
    ? undefined
    : Number(value);

const toDateInputValue = (value: string | null) =>
  value ? value.slice(0, 10) : "";

export function shipmentToFormValues(
  shipment: ShipmentListItem,
  fallbackCurrency = "",
): ShipmentFormValues {
  return {
    order_uuid: shipment.order?.id ?? "",
    shipping_company_uuid: shipment.shipping_company?.id ?? "",
    delivery_option_id: shipment.delivery_option_id ?? "",
    tracking_id: shipment.tracking_id ?? "",
    shipping_id: shipment.shipping_id ?? "",
    picking_type: shipment.picking_type ?? "PICKUP_BY_DC",
    price: toNumber(shipment.price),
    cod_amount: toNumber(shipment.cod_amount),
    declared_value: toNumber(shipment.declared_value),
    currency: shipment.currency || fallbackCurrency,
    package_count: shipment.package?.count,
    package_weight: toNumber(shipment.package?.weight),
    box_width: toNumber(shipment.package?.width),
    box_length: toNumber(shipment.package?.length),
    box_height: toNumber(shipment.package?.height),
    tracking_url: shipment.tracking_url ?? "",
    awb_url: shipment.awb_url ?? "",
    driver_name: shipment.driver?.name ?? "",
    driver_phone: shipment.driver?.phone ?? "",
    estimated_pickup_date: toDateInputValue(shipment.estimated_pickup_date),
    estimated_delivery_date: toDateInputValue(shipment.estimated_delivery_date),
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
    notes: shipment.notes ?? "",
  };
}

function buildFullPayload(values: ShipmentFormValues): ShipmentPayload {
  return {
    shipping_company_uuid: values.shipping_company_uuid || null,
    delivery_option_id: values.delivery_option_id || null,
    tracking_id: values.tracking_id || null,
    shipping_id: values.shipping_id || null,
    picking_type: values.picking_type,
    price: values.price ?? null,
    cod_amount: values.cod_amount ?? null,
    declared_value: values.declared_value ?? null,
    currency: values.currency || null,
    package_count: values.package_count ?? null,
    package_weight: values.package_weight ?? null,
    box_width: values.box_width ?? null,
    box_length: values.box_length ?? null,
    box_height: values.box_height ?? null,
    tracking_url: values.tracking_url || null,
    awb_url: values.awb_url || null,
    driver_name: values.driver_name || null,
    driver_phone: values.driver_phone || null,
    estimated_pickup_date: values.estimated_pickup_date || null,
    estimated_delivery_date: values.estimated_delivery_date || null,
    notes: values.notes || null,
    sender_name: values.sender_name || null,
    sender_mobile: values.sender_mobile || null,
    sender_email: values.sender_email || null,
    sender_address: values.sender_address || null,
    sender_latitude: values.sender_latitude ?? null,
    sender_longitude: values.sender_longitude ?? null,
    sender_city_uuid: values.sender_city_uuid || null,
    recipient_name: values.recipient_name || null,
    recipient_mobile: values.recipient_mobile || null,
    recipient_email: values.recipient_email || null,
    recipient_address: values.recipient_address || null,
    recipient_district: values.recipient_district || null,
    recipient_postcode: values.recipient_postcode || null,
    recipient_short_address_code: values.recipient_short_address_code || null,
    recipient_latitude: values.recipient_latitude ?? null,
    recipient_longitude: values.recipient_longitude ?? null,
    recipient_city_uuid: values.recipient_city_uuid || null,
  };
}

/**
 * Every field is optional on create — the API falls back to the order's own data
 * and the configured defaults — so only send what the operator actually filled in.
 * Tracking urls and driver details are edit-only, so they never go out here.
 */
export function buildAddShipmentPayload(
  values: ShipmentFormValues,
): ShipmentPayload {
  const full = buildFullPayload(values);
  const payload: ShipmentPayload = {};

  (Object.keys(full) as (keyof ShipmentPayload)[]).forEach((key) => {
    if (key === "tracking_url" || key === "awb_url") return;
    if (key === "driver_name" || key === "driver_phone") return;
    if (full[key] === null || full[key] === undefined) return;
    (payload as Record<string, unknown>)[key] = full[key];
  });

  return payload;
}

export function buildChangedShipmentPayload(
  values: ShipmentFormValues,
  dirtyFields: Partial<Record<keyof ShipmentFormValues, boolean>>,
  countryCode: string,
): ShipmentPayload {
  const full = buildFullPayload(values);
  const payload: ShipmentPayload = {};

  editableFields.forEach((field) => {
    if (!dirtyFields[field]) return;
    (payload as Record<string, unknown>)[field] = full[field];
  });

  if (dirtyFields.driver_phone && values.driver_phone) {
    payload.driver_phone = normalizeTenantPhone(values.driver_phone, countryCode)!;
  }

  return payload;
}

export function hasPayloadEntries(payload: ShipmentPayload) {
  return Object.keys(payload).length > 0;
}

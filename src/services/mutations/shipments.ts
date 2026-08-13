"use server";

import { safeApi } from "..";
import type {
  ShipmentCancelPayload,
  ShipmentPayload,
  ShipmentStatusPayload,
} from "@/types";

export const addShipmentForOrder = async (
  orderId: string,
  payload: ShipmentPayload,
) => await safeApi("POST", `/orders/${orderId}/shipments/add`, payload);

export const editShipment = async (
  shipmentId: string,
  payload: ShipmentPayload,
) => await safeApi("POST", `/shipments/${shipmentId}/edit`, payload);

export const updateShipmentStatus = async (
  shipmentId: string,
  payload: ShipmentStatusPayload,
) => await safeApi("POST", `/shipments/${shipmentId}/status`, payload);

export const cancelShipment = async (
  shipmentId: string,
  payload: ShipmentCancelPayload = {},
) => await safeApi("POST", `/shipments/${shipmentId}/cancel`, payload);

export const deleteShipment = async (shipmentId: string) =>
  await safeApi("DELETE", `/shipments/${shipmentId}/delete`);

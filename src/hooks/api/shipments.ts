import { useCustomQuery } from "..";
import {
  orderShipmentsAPI,
  shipmentsAPI,
  singleShipmentAPI,
} from "@/services/queries";
import type { ShipmentsQueryParams } from "@/types";

export function useShipments(params: ShipmentsQueryParams) {
  return useCustomQuery(["shipments", params], async () => shipmentsAPI(params));
}

export function useShipment(shipmentId: string | null) {
  return useCustomQuery(
    ["shipment", shipmentId],
    async () => singleShipmentAPI(shipmentId!),
    { enabled: Boolean(shipmentId) },
  );
}

export function useOrderShipments(orderId: string | null, limit?: number) {
  return useCustomQuery(
    ["order-shipments", orderId, limit],
    async () => orderShipmentsAPI(orderId!, limit),
    { enabled: Boolean(orderId) },
  );
}

import { keepPreviousData } from "@tanstack/react-query";

import { useCustomQuery } from "..";
import {
  mobilityReceiptsAPI,
  singleMobilityReceiptAPI,
} from "@/services/queries";
import type { MobilityReceiptQueryParams } from "@/types";

export function useMobilityReceipts(params: MobilityReceiptQueryParams) {
  return useCustomQuery(
    ["mobility-receipts", params],
    async () => mobilityReceiptsAPI(params),
    { placeholderData: keepPreviousData },
  );
}

export function useMobilityReceipt(vehicleId: string | null) {
  return useCustomQuery(
    ["mobility-receipt", vehicleId],
    async () => singleMobilityReceiptAPI(vehicleId!),
    { enabled: Boolean(vehicleId) },
  );
}

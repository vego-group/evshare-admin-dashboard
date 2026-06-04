import { walletAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import type { WalletQueryParams } from "@/types";

export function useWallet(params: WalletQueryParams) {
  return useCustomQuery(["wallet", params], async () => walletAPI(params));
}

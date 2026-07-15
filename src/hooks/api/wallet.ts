import { singleWalletTransactionAPI, walletAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import type { WalletQueryParams } from "@/types";

export function useWallet(params: WalletQueryParams) {
  return useCustomQuery(["wallet", params], async () => walletAPI(params));
}

export function useWalletTransaction(transactionId: string | null) {
  return useCustomQuery(
    ["wallet-transaction", transactionId],
    async () => singleWalletTransactionAPI(transactionId!),
    { enabled: Boolean(transactionId) },
  );
}

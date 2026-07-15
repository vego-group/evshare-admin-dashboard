import { baseAPI } from "..";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  WalletListResponse,
  WalletQueryParams,
  WalletTransactionResponse,
} from "@/types";

export const walletAPI = async (
  params: WalletQueryParams,
): Promise<WalletListResponse> => {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    days: params.days,
    status: params.status,
    order_by: params.order_by,
  });

  return await baseAPI("GET", `/wallet?${query}`);
};

export const singleWalletTransactionAPI = async (
  transactionId: string,
): Promise<WalletTransactionResponse> =>
  await baseAPI("GET", `/wallet/${transactionId}`);

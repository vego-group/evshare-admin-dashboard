"use client";

import { useState } from "react";

import { PAGE_SIZE } from "@/constants";
import { useWallet } from "@/hooks/api";
import type { OrderBy, WalletChartDays, WalletQueryParams, WalletTransactionStatus } from "@/types";

import WalletContentShimmer from "./content-shimmer";
import WalletHeader, { type WalletViewMode } from "./header";
import WalletStats from "./stats";
import WalletChart from "./chart";
import WalletToolbar from "./toolbar";
import WalletResults from "./results";
import WalletPagination from "./pagination";

type FlatParams = {
  page: string;
  limit: string;
  days: WalletChartDays;
  status?: WalletTransactionStatus;
  order_by?: OrderBy;
};

function Wallet() {
  const [viewMode, setViewMode] = useState<WalletViewMode>("table");
  const [params, setParams] = useState<FlatParams>({
    page: "1",
    limit: String(PAGE_SIZE),
    days: 30,
  });

  const { data, isLoading } = useWallet(params as WalletQueryParams);

  const updateParams = (next: Partial<FlatParams>) =>
    setParams((current) => ({ ...current, ...next }));

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <WalletContentShimmer />
      ) : (
        <>
          <WalletHeader viewMode={viewMode} onViewModeChange={setViewMode} />
          <WalletStats data={data?.analytics} />
          <WalletChart
            data={data?.chart_data}
            days={params.days}
            onDaysChange={(days) => updateParams({ days, page: "1" })}
          />
          <WalletToolbar
            selectedSort={params.order_by ?? "desc"}
            selectedStatus={params.status}
            onSortChange={(order_by: OrderBy) => updateParams({ order_by, page: "1" })}
            onStatusChange={(status?: WalletTransactionStatus) =>
              updateParams({ status, page: "1" })
            }
          />
          <WalletResults transactions={data?.data ?? []} viewMode={viewMode} />
          <WalletPagination
            meta={data?.meta}
            onPageChange={(page) => updateParams({ page: String(page) })}
          />
        </>
      )}
    </div>
  );
}

export default Wallet;

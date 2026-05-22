"use client";

import { useState } from "react";

import { PAGE_SIZE } from "@/constants";
import { useOrders } from "@/hooks/api";
import type { OrderBy, OrderNewStatus, OrderQueryParams, OrderStatusCategory } from "@/types";

import OrdersContentShimmer from "./content-shimmer";
import OrdersHeader, { type OrdersViewMode } from "./header";
import OrdersPagination from "./pagination";
import OrdersResults from "./results";
import OrdersStats from "./stats";
import OrdersToolbar from "./toolbar";

type FlatParams = {
  page: string;
  limit: string;
  status_category?: OrderStatusCategory;
  status?: OrderNewStatus;
  order_by?: OrderBy;
  search?: string;
};

function Orders() {
  const [viewMode, setViewMode] = useState<OrdersViewMode>("table");
  const [params, setParams] = useState<FlatParams>({
    page: "1",
    limit: String(PAGE_SIZE),
  });

  const { data, isLoading } = useOrders(params as OrderQueryParams);

  const updateParams = (next: Partial<FlatParams>) =>
    setParams((current) => ({ ...current, ...next }));

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <OrdersContentShimmer />
      ) : (
        <>
          <OrdersHeader viewMode={viewMode} onViewModeChange={setViewMode} />
          <OrdersStats data={data?.analytics} />
          <OrdersToolbar
            searchQuery={params.search ?? ""}
            selectedSort={params.order_by ?? "desc"}
            selectedStatusCategory={params.status_category}
            selectedStatus={params.status}
            onSearchChange={(search) => updateParams({ search: search || undefined, page: "1" })}
            onSortChange={(order_by: OrderBy) => updateParams({ order_by, page: "1" })}
            onStatusCategoryChange={(status_category?: OrderStatusCategory) =>
              updateParams({ status_category, status: undefined, page: "1" })
            }
            onStatusChange={(status?: OrderNewStatus) => updateParams({ status, page: "1" })}
          />
          <OrdersResults orders={data?.data ?? []} viewMode={viewMode} />
          <OrdersPagination
            meta={data?.meta}
            onPageChange={(page) => updateParams({ page: String(page) })}
          />
        </>
      )}
    </div>
  );
}

export default Orders;

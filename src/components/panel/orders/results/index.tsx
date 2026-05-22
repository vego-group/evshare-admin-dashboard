import EmptyState from "@/components/ui/empty-state";
import type { OrderListItem } from "@/types";

import type { OrdersViewMode } from "../header";
import OrdersTable from "../table";
import OrdersCards from "./orders-cards";

type OrdersResultsProps = {
  orders: OrderListItem[];
  viewMode: OrdersViewMode;
};

function OrdersResults({ orders, viewMode }: OrdersResultsProps) {
  if (!orders.length) {
    return <EmptyState description="لا توجد طلبات." />;
  }

  return viewMode === "table" ? (
    <OrdersTable orders={orders} />
  ) : (
    <OrdersCards orders={orders} />
  );
}

export default OrdersResults;

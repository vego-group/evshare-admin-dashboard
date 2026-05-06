"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { productOrders } from "@/data";
import type { ProductOrder, ProductOrderStatus } from "@/types";

import ProductOrderDetailsPanel from "./details-panel";
import ProductOrdersStats from "./stats";
import ProductOrdersTable from "./table";
import ProductOrdersToolbar from "./toolbar";

function ProductOrders() {
  const [orders, setOrders] = useState(productOrders);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(
    null,
  );

  const selectedOrder =
    selectedOrderIndex === null ? null : orders[selectedOrderIndex];

  const handleStatusChange = (index: number, status: ProductOrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order, orderIndex) =>
        orderIndex === index ? { ...order, status } : order,
      ),
    );
  };

  const handleSelectedOrderStatusChange = (status: ProductOrderStatus) => {
    if (selectedOrderIndex === null) return;
    handleStatusChange(selectedOrderIndex, status);
  };

  const handleViewOrder = (order: ProductOrder) => {
    const orderIndex = orders.findIndex((currentOrder) => currentOrder === order);
    setSelectedOrderIndex(orderIndex >= 0 ? orderIndex : null);
  };

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Header
          title="طلبات المنتجات"
          subtitle="إدارة ومراجعة طلبات المنتجات من التجار"
        />
        <ProductOrdersStats />
        <ProductOrdersToolbar />
        <ProductOrdersTable
          orders={orders}
          onStatusChange={handleStatusChange}
          onViewOrder={handleViewOrder}
        />
      </div>

      <ProductOrderDetailsPanel
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrderIndex(null)}
        onStatusChange={handleSelectedOrderStatusChange}
      />
    </>
  );
}

export default ProductOrders;

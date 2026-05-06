"use client";

import { useState } from "react";

import Panel from "@/components/ui/panel";
import type { ProductOrder, ProductOrderStatus } from "@/types";

import ProductOrderDateCard from "./product-order-date-card";
import ProductOrderDetailsFooter from "./product-order-details-footer";
import ProductOrderDetailsHeader from "./product-order-details-header";
import ProductOrderImageSection from "./product-order-image-section";
import ProductOrderInfoSection from "./product-order-info-section";
import ProductOrderMerchantSection from "./product-order-merchant-section";
import ProductOrderReviewAlert from "./product-order-review-alert";
import RejectOrderModal from "./reject-order";

type ProductOrderDetailsPanelProps = {
  order: ProductOrder | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: ProductOrderStatus) => void;
};

function ProductOrderDetailsPanel({
  order,
  open,
  onClose,
  onStatusChange,
}: ProductOrderDetailsPanelProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  if (!order) return null;

  return (
    <>
      <Panel
        open={open}
        onClose={onClose}
        contentClassName="w-full gap-0 overflow-hidden sm:rounded-l-3xl sm:border-l-0 bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="flex h-full min-h-0 flex-col text-right">
          <ProductOrderDetailsHeader orderId={order.id} />

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <ProductOrderReviewAlert />
            <ProductOrderImageSection order={order} />
            <ProductOrderInfoSection order={order} />
            <ProductOrderMerchantSection order={order} />
            <ProductOrderDateCard order={order} />
          </div>

          <ProductOrderDetailsFooter
            onRejectClick={() => setRejectModalOpen(true)}
            onStatusChange={onStatusChange}
          />
        </div>
      </Panel>

      <RejectOrderModal
        open={rejectModalOpen}
        productName={order.productName}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={() => {
          onStatusChange("مرفوض");
          setRejectModalOpen(false);
        }}
      />
    </>
  );
}

export default ProductOrderDetailsPanel;

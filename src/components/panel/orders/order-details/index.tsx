"use client";

import { ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useOrder, useOrderReceipt } from "@/hooks/api";

import OrderShimmer from "./order-shimmer";
import OrderInfoSection from "./order-info-section";
import OrderItemsSection from "./order-items-section";
import OrderReceiptSection from "./receipt-section";

const RECEIPT_STATUSES = ["delivered", "completed"];

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useOrder(id ?? null);
  const order = data?.data;

  const shouldFetchReceipt = Boolean(
    order && !order.receipt && RECEIPT_STATUSES.includes(order.status),
  );
  const { data: receiptData } = useOrderReceipt(
    shouldFetchReceipt ? id : null,
    shouldFetchReceipt,
  );
  const receipt = order?.receipt ?? receiptData?.data ?? null;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة"
        >
          <ArrowRight className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold leading-8 text-secondary">تفاصيل الطلب</h1>
          {order ? (
            <p className="text-sm font-normal text-gray">رقم الطلب: {order.order_code}</p>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <OrderShimmer />
      ) : order ? (
        <>
          <OrderInfoSection order={order} />
          <OrderItemsSection items={order.items} />
          {receipt ? (
            <OrderReceiptSection orderId={order.id} receipt={receipt} />
          ) : null}
        </>
      ) : (
        <div className="flex min-h-80 items-center justify-center rounded-[14px] bg-white px-4 text-center text-base text-gray">
          تعذر تحميل تفاصيل الطلب.
        </div>

      )}
    </div>
  );
}

export default OrderDetails;

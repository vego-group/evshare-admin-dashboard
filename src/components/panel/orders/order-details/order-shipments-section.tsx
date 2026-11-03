"use client";

import { ArrowLeft, Package, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import PermissionGate from "@/components/permission-gate";
import { ShipmentFormModal } from "@/components/panel/shipments/modals";
import {
  StatusBadge,
  formatDate,
} from "@/components/panel/shipments/results/shipment-result-parts";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import QueryErrorState from "@/components/ui/query-error-state";
import Shimmer from "@/components/ui/shimmer";
import { useOrderShipments } from "@/hooks/api";
import type { OrderDetail, ShipmentListItem } from "@/types";

type Props = {
  order: OrderDetail;
};

const REUSABLE_SHIPMENT_STATUSES = new Set(["cancelled", "returned"]);

export function getShipmentCreateBlockReason({
  hasAddress,
  orderStatus,
  shipments,
}: {
  hasAddress: boolean;
  orderStatus: OrderDetail["status"];
  shipments: ShipmentListItem[];
}) {
  if (!hasAddress) return "أضف عنوان تسليم للطلب قبل إنشاء الشحنة";
  if (orderStatus === "draft" || orderStatus === "cancelled") {
    return "لا يمكن إنشاء شحنة لطلب مسودة أو ملغى";
  }

  const hasBlockingForwardShipment = shipments.some(
    (shipment) =>
      shipment.direction === "forward" &&
      !REUSABLE_SHIPMENT_STATUSES.has(shipment.status),
  );

  return hasBlockingForwardShipment
    ? "يوجد للطلب شحنة أمامية قائمة؛ ألغها أولاً قبل إنشاء شحنة جديدة"
    : null;
}

export default function OrderShipmentsSection({ order }: Props) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data, isLoading, isError, isFetching, refetch } = useOrderShipments(
    order.id,
    200,
  );
  const shipments = data?.data ?? [];
  const createBlockReason = getShipmentCreateBlockReason({
    hasAddress: Boolean(order.address),
    orderStatus: order.status,
    shipments,
  });

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["order-shipments", order.id],
      }),
      queryClient.invalidateQueries({ queryKey: ["shipments"] }),
    ]);
  }

  return (
    <section className="space-y-4 rounded-[14px] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-secondary">شحنات الطلب</h2>
          <p className="mt-1 text-sm text-gray">
            تتبع سجل الشحنات وارفع شحنة جديدة مباشرة من الطلب.
          </p>
        </div>

        <PermissionGate slug="Admin Add Shipments">
          <span title={createBlockReason ?? undefined}>
            <Button
              type="button"
              disabled={Boolean(createBlockReason) || isLoading}
              onClick={() => setIsCreateOpen(true)}
              className="h-11 rounded-xl bg-primary px-5 font-semibold text-secondary hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" aria-hidden="true" />
              إنشاء شحنة
            </Button>
          </span>
        </PermissionGate>
      </div>

      {createBlockReason ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-orange-700">
          {createBlockReason}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-2" aria-hidden="true">
          <Shimmer className="h-20 w-full rounded-xl" />
          <Shimmer className="h-20 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <QueryErrorState
          title="تعذر تحميل شحنات الطلب"
          isRetrying={isFetching}
          onRetry={() => void refetch()}
        />
      ) : shipments.length === 0 ? (
        <EmptyState description="لم تُنشأ أي شحنة لهذا الطلب بعد." />
      ) : (
        <div className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-100">
          {shipments.map((shipment) => (
            <Link
              key={shipment.id}
              href={`/shipments/${shipment.id}`}
              className="flex items-center gap-3 bg-white px-4 py-4 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
                <Package className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-semibold text-secondary" dir="ltr">
                    {shipment.tracking_id ?? shipment.shipping_id ?? "بدون رقم تتبع"}
                  </span>
                  <StatusBadge shipment={shipment} />
                </span>
                <span className="mt-1 block truncate text-sm text-gray">
                  {shipment.shipping_company?.name ?? "لم تُحدد شركة الشحن"} · {formatDate(shipment.created_at)}
                </span>
              </span>
              <ArrowLeft className="size-5 shrink-0 text-gray" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}

      {isCreateOpen ? (
        <ShipmentFormModal
          key={`order-shipment-${order.id}`}
          open={isCreateOpen}
          initialOrder={{ id: order.id, orderCode: order.order_code }}
          onClose={() => setIsCreateOpen(false)}
          onSaved={refresh}
        />
      ) : null}
    </section>
  );
}


"use client";

import { shipmentPickingTypeLabels } from "@/data";
import type { ShipmentDetail } from "@/types";

import ShipmentDetailsShimmer from "../modals/shipment-details-shimmer";
import {
  DirectionBadge,
  ShipmentIcon,
  StatusBadge,
  formatDate,
  formatDateOnly,
} from "../results/shipment-result-parts";
import { DetailRow, DetailSection, StatCard } from "./shipment-detail-parts";
import ShipmentHistories from "./shipment-histories";
import ShipmentParties from "./shipment-parties";

type ShipmentDetailsContentProps = {
  shipment?: ShipmentDetail;
  isLoading: boolean;
};

export function ShipmentDetailsContent({
  shipment,
  isLoading,
}: ShipmentDetailsContentProps) {
  if (isLoading) return <ShipmentDetailsShimmer />;

  if (!shipment) {
    return (
      <div className="flex min-h-55 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
        تعذر تحميل تفاصيل الشحنة.
      </div>
    );
  }

  const { package: parcel } = shipment;

  return (
    <div className="flex min-w-0 flex-col gap-6 text-right">
      <div className="flex flex-col gap-4 rounded-[14px] bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <ShipmentIcon />
          <div className="space-y-2">
            <h3 className="w-full break-all text-xl font-bold text-secondary" dir="ltr">
              {shipment.tracking_id ?? shipment.order?.order_code ?? "—"}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <DirectionBadge shipment={shipment} />
              <StatusBadge shipment={shipment} />
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="تكلفة الشحن"
          value={`${shipment.price ?? 0} ${shipment.currency}`}
        />
        <StatCard
          label="مبلغ التحصيل"
          value={`${shipment.cod_amount ?? 0} ${shipment.currency}`}
        />
        <StatCard
          label="القيمة المعلنة"
          value={`${shipment.declared_value ?? 0} ${shipment.currency}`}
        />
        <StatCard
          label="محاولات التسليم"
          value={String(shipment.attempts_count)}
        />
      </section>

      <DetailSection title="بيانات الشحنة">
        <DetailRow label="رقم الطلب" value={shipment.order?.order_code} dir="ltr" />
        <DetailRow label="العميل" value={shipment.order?.customer_name} />
        <DetailRow label="شركة الشحن" value={shipment.shipping_company?.name} />
        <DetailRow
          label="معرّف الخدمة"
          value={shipment.delivery_option_id}
          dir="ltr"
        />
        <DetailRow
          label="رقم الشحنة لدى الناقل"
          value={shipment.shipping_id}
          dir="ltr"
        />
        <DetailRow
          label="طريقة الاستلام"
          value={
            shipment.picking_type
              ? shipmentPickingTypeLabels[shipment.picking_type]
              : null
          }
        />
        <DetailRow
          label="الطرد"
          value={`${parcel?.count ?? 1} طرد — ${parcel?.weight ?? "-"} كجم — ${
            parcel?.width ?? "-"
          }×${parcel?.length ?? "-"}×${parcel?.height ?? "-"} سم`}
        />
        <DetailRow label="ملاحظات" value={shipment.notes} />
        <DetailRow label="سبب الفشل" value={shipment.failure_reason} />
      </DetailSection>

      <DetailSection title="الروابط والمندوب">
        <DetailRow label="رابط التتبع" value={shipment.tracking_url} dir="ltr" />
        <DetailRow
          label="رابط التتبع الخاص"
          value={shipment.branded_tracking_url}
          dir="ltr"
        />
        <DetailRow label="بوليصة الشحن" value={shipment.awb_url} dir="ltr" />
        <DetailRow label="اسم المندوب" value={shipment.driver?.name} />
        <DetailRow label="جوال المندوب" value={shipment.driver?.phone} dir="ltr" />
      </DetailSection>

      <DetailSection title="المواعيد">
        <DetailRow
          label="الاستلام المتوقع"
          value={formatDateOnly(shipment.estimated_pickup_date)}
        />
        <DetailRow
          label="التسليم المتوقع"
          value={formatDateOnly(shipment.estimated_delivery_date)}
        />
        <DetailRow label="تاريخ الشحن" value={formatDate(shipment.shipped_at)} />
        <DetailRow label="تاريخ الاستلام" value={formatDate(shipment.picked_up_at)} />
        <DetailRow label="تاريخ التسليم" value={formatDate(shipment.delivered_at)} />
        <DetailRow label="تاريخ الإلغاء" value={formatDate(shipment.cancelled_at)} />
        <DetailRow label="تاريخ الإنشاء" value={formatDate(shipment.created_at)} />
      </DetailSection>

      <ShipmentParties shipment={shipment} />

      <DetailSection title="سجل الحالات">
        <ShipmentHistories histories={shipment.histories ?? []} />
      </DetailSection>
    </div>
  );
}

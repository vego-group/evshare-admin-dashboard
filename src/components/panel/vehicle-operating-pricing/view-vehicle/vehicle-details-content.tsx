"use client";

import { SaudiRiyal } from "lucide-react";
import type { ReactNode } from "react";

import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import {
  formatDate,
  formatMoney,
  formatPercentage,
  pricingFields,
  zoneTypeLabel,
} from "../utils";

type Props = {
  vehicle?: VehicleListItem;
  isLoading: boolean;
};

export function VehicleDetailsContent({ vehicle, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex min-h-55 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
        جارِ التحميل...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-55 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
        تعذر تحميل تفاصيل المركبة.
      </div>
    );
  }

  const location = vehicle.location;

  return (
    <div className="flex min-w-0 flex-col gap-6 text-right">
      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">البيانات الأساسية</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="معرف المركبة" value={<span dir="ltr">{vehicle.id}</span>} />
          <DetailRow label="الحالة" value={<StatusBadge status={vehicle.status} />} />
          <DetailRow label="نوع التشغيل" value={vehicle.operating_type === "evshare" ? "EvShare" : "شركة تشغيل"} />
          <DetailRow label="شركة التشغيل" value={vehicle.operation_company?.name} />
          <DetailRow label="العمولة" value={formatPercentage(vehicle.operation_company?.pricing_percentage ?? vehicle.operation_company?.commission_percentage)} />
          <DetailRow label="رقم المستخدم" value={vehicle.user_id} />
          <DetailRow label="رقم عنصر الطلب" value={vehicle.order_item_id} />
          <DetailRow label="تاريخ الإنشاء" value={<span dir="ltr">{formatDate(vehicle.created_at)}</span>} />
        </div>
      </section>

      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">الموقع</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="اسم الموقع" value={location?.label} />
          <DetailRow label="العنوان" value={location?.address} />
          <DetailRow label="خط العرض" value={<span dir="ltr">{location?.latitude ?? "-"}</span>} />
          <DetailRow label="خط الطول" value={<span dir="ltr">{location?.longitude ?? "-"}</span>} />
        </div>
      </section>

      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">التسعير الحالي</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {pricingFields.map(([key, label]) => (
            <DetailRow key={key} label={label} value={<MoneyValue value={formatMoney(vehicle[key])} />} />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">جهاز IoT والبطارية</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="معرف الجهاز" value={<span dir="ltr">{vehicle.iot_device_id ?? "-"}</span>} />
          <DetailRow label="نسبة البطارية" value={vehicle.battery_percentage != null ? `${vehicle.battery_percentage}%` : undefined} />
          <DetailRow label="آخر تحديث" value={<span dir="ltr">{formatDate(vehicle.updated_at)}</span>} />
        </div>
      </section>

      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">المنتج المرتبط</h4>
        {vehicle.product ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <DetailRow label="اسم المنتج" value={vehicle.product.title} />
            <DetailRow label="السعر" value={<MoneyValue value={formatMoney(vehicle.product.price)} />} />
            <DetailRow label="الكمية" value={vehicle.product.quantity} />
            <DetailRow label="الحالة" value={<StatusBadge status={vehicle.product.active ? "active" : "disabled"} />} />
          </div>
        ) : (
          <p className="text-sm text-gray">لا يوجد منتج مرتبط</p>
        )}
      </section>

      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">مناطق التشغيل</h4>
        {vehicle.zones.length ? (
          <div className="space-y-3">
            {vehicle.zones.map((zone) => (
              <div key={zone.id} className="grid gap-2 rounded-[10px] bg-white p-3 sm:grid-cols-2">
                <DetailRow label="اسم المنطقة" value={zone.name_ar} />
                <DetailRow label="النوع" value={zoneTypeLabel(zone.type)} />
                <DetailRow label="حد السرعة" value={zone.speed_limit} />
                <DetailRow label="الحالة" value={<StatusBadge status={zone.is_active ? "active" : "disabled"} />} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray">لم يتم تعيين مناطق تشغيل لهذه المركبة</p>
        )}
      </section>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: ReactNode | null }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-white px-4 py-3 text-right">
      <span className="text-sm text-gray">{label}</span>
      <span className="w-full break-all text-base font-medium text-secondary">
        {value ?? "-"}
      </span>
    </div>
  );
}

function MoneyValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) return null;
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <SaudiRiyal className="size-4 shrink-0" /> {String(value)}
    </span>
  );
}

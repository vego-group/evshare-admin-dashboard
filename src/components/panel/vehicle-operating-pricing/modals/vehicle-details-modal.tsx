import Modal from "@/components/ui/modal";
import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import {
  formatDate,
  formatMoney,
  formatPercentage,
  pricingFields,
  vehicleTitle,
  zoneTypeLabel,
} from "../utils";

import DetailRow from "./detail-row";

function VehicleDetailsModal({
  open,
  vehicle,
  onClose,
}: {
  open: boolean;
  vehicle: VehicleListItem | null;
  onClose: () => void;
}) {
  if (!vehicle) return null;

  const location = vehicle.location;

  return (
    <Modal open={open} onClose={onClose} title={vehicleTitle(vehicle)} contentClassName="max-w-3xl">
      <div className="space-y-5 p-1">
        <section className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="معرف المركبة" value={<span dir="ltr">{vehicle.id}</span>} />
          <DetailRow label="الحالة" value={<StatusBadge status={vehicle.status} />} />
          <DetailRow label="نوع التشغيل" value={vehicle.operating_type === "evshare" ? "EvShare" : "شركة تشغيل"} />
          <DetailRow label="شركة التشغيل" value={vehicle.operation_company?.name ?? "-"} />
          <DetailRow label="العمولة" value={formatPercentage(vehicle.operation_company?.pricing_percentage ?? vehicle.operation_company?.commission_percentage)} />
          <DetailRow label="رقم المستخدم" value={vehicle.user_id ?? "-"} />
          <DetailRow label="رقم عنصر الطلب" value={vehicle.order_item_id ?? "-"} />
          <DetailRow label="تاريخ الإنشاء" value={<span dir="ltr">{formatDate(vehicle.created_at)}</span>} />
        </section>

        <section>
          <h3 className="mb-3 font-semibold text-secondary">الموقع</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <DetailRow label="اسم الموقع" value={location?.label ?? "-"} />
            <DetailRow label="العنوان" value={location?.address ?? "-"} />
            <DetailRow label="خط العرض" value={<span dir="ltr">{location?.latitude ?? "-"}</span>} />
            <DetailRow label="خط الطول" value={<span dir="ltr">{location?.longitude ?? "-"}</span>} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-semibold text-secondary">التسعير الحالي</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {pricingFields.map(([key, label]) => (
              <DetailRow key={key} label={label} value={formatMoney(vehicle[key])} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-semibold text-secondary">جهاز IoT والبطارية</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <DetailRow label="معرف الجهاز" value={<span dir="ltr">{vehicle.iot_device_id ?? "-"}</span>} />
            <DetailRow label="نسبة البطارية" value={vehicle.battery_percentage != null ? `${vehicle.battery_percentage}%` : "-"} />
            <DetailRow label="آخر تحديث" value={<span dir="ltr">{formatDate(vehicle.updated_at)}</span>} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-semibold text-secondary">المنتج المرتبط</h3>
          {vehicle.product ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <DetailRow label="اسم المنتج" value={vehicle.product.title} />
              <DetailRow label="السعر" value={formatMoney(vehicle.product.price)} />
              <DetailRow label="الكمية" value={vehicle.product.quantity} />
              <DetailRow label="الحالة" value={<StatusBadge status={vehicle.product.active ? "active" : "disabled"} />} />
            </div>
          ) : (
            <p className="text-sm text-gray">لا يوجد منتج مرتبط</p>
          )}
        </section>

        <section>
          <h3 className="mb-3 font-semibold text-secondary">مناطق التشغيل</h3>
          {vehicle.zones.length ? (
            <div className="space-y-3">
              {vehicle.zones.map((zone) => (
                <div key={zone.id} className="grid gap-2 rounded-lg border border-primary/10 p-3 sm:grid-cols-2">
                  <DetailRow label="اسم المنطقة" value={zone.name_ar} />
                  <DetailRow label="النوع" value={zoneTypeLabel(zone.type)} />
                  <DetailRow label="حد السرعة" value={zone.speed_limit ?? "-"} />
                  <DetailRow label="الحالة" value={<StatusBadge status={zone.is_active ? "active" : "disabled"} />} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray">لم يتم تعيين مناطق تشغيل لهذه المركبة</p>
          )}
        </section>
      </div>
    </Modal>
  );
}

export default VehicleDetailsModal;
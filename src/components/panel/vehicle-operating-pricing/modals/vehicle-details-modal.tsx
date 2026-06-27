import Modal from "@/components/ui/modal";
import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import { formatDate, formatMoney, formatPercentage, pricingFields, vehicleTitle } from "../utils";
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
  const contract = vehicle.vehicle_contract;
  return (
    <Modal open={open} onClose={onClose} title={vehicleTitle(vehicle)} contentClassName="max-w-2xl">
      <div className="space-y-5 p-1">
        <section className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="الحالة" value={<StatusBadge status={vehicle.status} />} />
          <DetailRow label="حالة التفعيل" value={<StatusBadge status={vehicle.activation_status} />} />
          <DetailRow label="نوع التشغيل" value={vehicle.operating_type === "evshare" ? "EvShare" : "شركة تشغيل"} />
          <DetailRow label="شركة التشغيل" value={vehicle.operation_company?.name ?? "-"} />
          <DetailRow label="العمولة" value={formatPercentage(vehicle.operation_company?.pricing_percentage ?? vehicle.operation_company?.commission_percentage)} />
          <DetailRow label="رقم المستخدم" value={vehicle.user_id ?? "-"} />
          <DetailRow label="رقم عنصر الطلب" value={vehicle.order_item_id ?? "-"} />
          <DetailRow label="تاريخ الإنشاء" value={<span dir="ltr">{formatDate(vehicle.created_at)}</span>} />
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
          <h3 className="mb-3 font-semibold text-secondary">العقد</h3>
          <div className="grid gap-2">
            <DetailRow label="حالة العقد" value={<StatusBadge status={contract?.status} />} />
            <DetailRow label="سبب الرفض" value={contract?.rejection_reason ?? "-"} />
            <DetailRow label="تاريخ العقد" value={<span dir="ltr">{formatDate(contract?.created_at)}</span>} />
          </div>
        </section>
      </div>
    </Modal>
  );
}

export default VehicleDetailsModal;

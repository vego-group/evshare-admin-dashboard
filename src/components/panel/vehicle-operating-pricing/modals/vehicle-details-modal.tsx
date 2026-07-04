import Modal from "@/components/ui/modal";
import type { VehicleContractTemplateFile, VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import {
  formatDate,
  formatMoney,
  formatPercentage,
  getVehicleTemplateStatus,
  pricingFields,
  vehicleTitle,
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

  const contract = vehicle.vehicle_contract;
  const location = vehicle.location;
  const templateFiles = vehicle.contract_template ?? [];

  return (
    <Modal open={open} onClose={onClose} title={vehicleTitle(vehicle)} contentClassName="max-w-3xl">
      <div className="space-y-5 p-1">
        <section className="grid gap-2 sm:grid-cols-2">
          <DetailRow label="معرف المركبة" value={<span dir="ltr">{vehicle.id}</span>} />
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
          <h3 className="mb-3 font-semibold text-secondary">العقد</h3>
          <div className="grid gap-2">
            <DetailRow label="حالة العقد" value={<StatusBadge status={contract?.status} />} />
            <DetailRow label="سبب الرفض" value={contract?.rejection_reason ?? "-"} />
            <DetailRow label="تاريخ العقد" value={<span dir="ltr">{formatDate(contract?.created_at)}</span>} />
            <DetailRow label="مرفقات العقد" value={<FilesList files={contract?.attachments ?? []} />} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-semibold text-secondary">قالب السند</h3>
          <div className="grid gap-2">
            <DetailRow label="حالة القالب" value={<StatusBadge status={getVehicleTemplateStatus(vehicle)} />} />
            <DetailRow label="ملفات القالب" value={<FilesList files={templateFiles} />} />
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
          <h3 className="mb-3 font-semibold text-secondary">منطقة التشغيل</h3>
          {vehicle.zone ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <DetailRow label="اسم المنطقة" value={vehicle.zone.name_ar} />
              <DetailRow label="النوع" value={vehicle.zone.type === "slow" ? "بطيئة" : "عادية"} />
              <DetailRow label="حد السرعة" value={vehicle.zone.speed_limit ?? "-"} />
              <DetailRow label="الحالة" value={<StatusBadge status={vehicle.zone.is_active ? "active" : "disabled"} />} />
            </div>
          ) : (
            <p className="text-sm text-gray">لم يتم تعيين منطقة تشغيل لهذه المركبة</p>
          )}
        </section>
      </div>
    </Modal>
  );
}

type FileLike = VehicleContractTemplateFile | string | { url?: string; name?: string; file_name?: string; document_type?: string | null };

function FilesList({ files }: { files: FileLike[] }) {
  if (!files.length) return "-";

  return (
    <div className="flex flex-col gap-1 text-left" dir="ltr">
      {files.map((file, index) => {
        const url = typeof file === "string" ? file : file.url;
        const label = typeof file === "string"
          ? `File ${index + 1}`
          : file.name || file.file_name || file.document_type || `File ${index + 1}`;

        return url ? (
          <a key={index} href={url} target="_blank" rel="noreferrer" className="font-medium text-secondary underline">
            {label}
          </a>
        ) : (
          <span key={index}>{label}</span>
        );
      })}
    </div>
  );
}

export default VehicleDetailsModal;
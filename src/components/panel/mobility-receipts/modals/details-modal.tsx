import Modal from "@/components/ui/modal";
import type { MobilityReceipt } from "@/types";
import { DetailsSummary, InfoSection, TemplateFiles } from "./details-modal-parts";
import {
  formatLocation,
  formatMoney,
  formatOperatingType,
  formatReceiptDate,
  receiptTitle,
} from "../utils";

type Props = {
  open: boolean;
  receipt: MobilityReceipt | null;
  onClose: () => void;
};

function ReceiptDetailsModal({ open, receipt, onClose }: Props) {
  if (!receipt) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`تفاصيل سند ${receiptTitle(receipt)}`}
      contentClassName="sm:max-w-3xl"
    >
      <div className="space-y-5 p-1">
        <DetailsSummary receipt={receipt} />
        <div className="grid gap-4 lg:grid-cols-2">
          <InfoSection
            title="بيانات المركبة"
            rows={[
              ["معرف المركبة", receipt.id],
              ["نوع التشغيل", formatOperatingType(receipt.operating_type)],
              ["الموقع", formatLocation(receipt)],
              ["تاريخ الإنشاء", formatReceiptDate(receipt.created_at)],
            ]}
          />
          <InfoSection
            title="بيانات الطلب"
            rows={[
              ["المستخدم", receipt.user_id ?? "-"],
              ["عنصر الطلب", receipt.order_item_id ?? "-"],
              ["شركة التشغيل", receipt.operation_company?.name ?? "-"],
              [
                "نسبة التسعير",
                receipt.operation_company?.pricing_percentage
                  ? `${receipt.operation_company.pricing_percentage}%`
                  : "-",
              ],
            ]}
          />
          <InfoSection
            title="التسعير"
            rows={[
              ["سعر فتح القفل", formatMoney(receipt.open_price)],
              ["سعر الدقيقة", formatMoney(receipt.price_per_minute)],
              ["سعر الكيلومتر", formatMoney(receipt.price_per_km)],
              ["سعر الساعة", formatMoney(receipt.price_per_hour)],
              ["سعر اليوم", formatMoney(receipt.price_per_day)],
            ]}
          />
          <InfoSection
            title="التواصل"
            rows={[
              ["البريد", receipt.operation_company?.email ?? "-"],
              ["الجوال", receipt.operation_company?.mobile ?? "-"],
            ]}
          />
        </div>
        <TemplateFiles receipt={receipt} />
      </div>
    </Modal>
  );
}

export default ReceiptDetailsModal;

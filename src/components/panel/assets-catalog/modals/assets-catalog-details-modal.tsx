import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import type { AssetItem } from "@/types";

type AssetsCatalogDetailsModalProps = {
  asset: AssetItem | null;
  open: boolean;
  onClose: () => void;
};

type DetailsFieldProps = {
  label: string;
  value: string;
  className?: string;
  suffix?: string;
  withChevron?: boolean;
};

function DetailsField({
  label,
  value,
  className,
  suffix,
  withChevron = false,
}: DetailsFieldProps) {
  return (
    <div className={className}>
      <span className="mb-2 block text-right text-sm font-medium leading-5 text-dark-gray">
        {label}
      </span>

      <div
        dir="rtl"
        className="flex h-14 w-full items-center justify-between gap-3 overflow-hidden rounded-[14px] border border-[#ffd01e] bg-[rgba(255,208,30,0.02)] px-4 py-3 text-sm font-medium leading-5 text-dark-gray"
      >
        <span className="min-w-0 truncate text-right">{value}</span>

        {suffix ? (
          <span className="grid h-12 w-16 shrink-0 place-items-center rounded-[14px] bg-[rgba(255,231,140,0.32)] text-sm text-dark-gray">
            {suffix}
          </span>
        ) : withChevron ? (
          <ChevronDown className="size-5 shrink-0 text-dark-gray" />
        ) : null}
      </div>
    </div>
  );
}

function AssetsCatalogDetailsModal({
  asset,
  open,
  onClose,
}: AssetsCatalogDetailsModalProps) {
  if (!asset) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="md:max-w-[700px] lg:max-w-[840px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <div dir="rtl" className="flex flex-col gap-9 py-3 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="text-right">
            <h2 className="text-[20px] font-medium leading-[30px] text-dark-gray">
              تفاصيل الأصل
            </h2>
            <p className="mt-1 text-sm font-medium leading-5 text-[#9da4ae]">
              تحديث تفاصيل شاحن سريع C12
            </p>
          </div>

          <Button
            type="button"
            size="icon"
            onClick={onClose}
            aria-label="إغلاق"
            className="size-10 rounded-[14px] bg-[#ffd01e] text-dark-gray hover:bg-[#f4c400] md:size-12"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <DetailsField label="اسم الأصل" value={asset.name} withChevron />
          <DetailsField
            label="السعر"
            value={asset.price.replace(/[^\d]/g, "")}
            suffix="ر.س"
          />
          <DetailsField label="النوع" value={asset.type} withChevron />
          <DetailsField label="الحالة" value={asset.status} withChevron />
          <DetailsField label="المدينة" value={asset.city} />
          <DetailsField label="الموقع التفصيلي" value={asset.location} />
          <DetailsField
            className="sm:col-span-2"
            label="معرف الأصل"
            value={asset.id}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AssetsCatalogDetailsModal;

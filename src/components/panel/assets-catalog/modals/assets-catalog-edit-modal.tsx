import { useMemo, useRef, useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { assetsCatalogItems } from "@/data";
import type { AssetItem } from "@/types";

type AssetsCatalogEditModalProps = {
  asset: AssetItem | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

type FieldProps = {
  label: string;
  value: string;
  required?: boolean;
  suffix?: string;
  options?: string[];
  onChange?: (value: string) => void;
  className?: string;
};

function Field({
  label,
  value,
  required = false,
  suffix,
  options,
  onChange,
  className,
}: FieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDropdown = Boolean(options?.length);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={className} ref={containerRef}>
      <span className="mb-2 block text-right text-sm font-medium leading-5 text-dark-gray">
        {label}
        {required && <span className="text-[#b42318]"> *</span>}
      </span>

      <div className="relative">
        {suffix ? (
          <div
            dir="rtl"
            className="flex h-14 w-full items-center justify-between gap-3 overflow-hidden rounded-[14px] border border-[#ffd01e] bg-[rgba(255,208,30,0.02)] px-4 py-3 text-sm font-medium leading-5 text-dark-gray"
          >
            <span className="min-w-0 truncate text-right">{value}</span>
            <span className="grid h-12 w-16 shrink-0 place-items-center rounded-[14px] bg-[rgba(255,231,140,0.45)] text-sm font-medium text-dark-gray">
              {suffix}
            </span>
          </div>
        ) : hasDropdown ? (
          <button
            type="button"
            dir="rtl"
            onClick={() => setIsOpen((current) => !current)}
            className={`flex h-14 w-full items-center justify-between gap-3 overflow-hidden rounded-[14px] border px-4 py-3 text-sm font-medium leading-5 text-dark-gray transition-colors ${
              isOpen
                ? "border-[#ffd01e] bg-[rgba(255,208,30,0.08)]"
                : "border-[#ffd01e] bg-[rgba(255,208,30,0.02)]"
            }`}
            aria-expanded={isOpen}
          >
            <span className="min-w-0 truncate text-right">{value}</span>
            <ChevronDown
              className={`size-5 shrink-0 text-dark-gray transition ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <div
            dir="rtl"
            className="flex h-14 w-full items-center overflow-hidden rounded-[14px] border border-[#ffd01e] bg-[rgba(255,208,30,0.02)] px-4 py-3 text-sm font-medium leading-5 text-dark-gray"
          >
            <span className="min-w-0 truncate text-right">{value}</span>
          </div>
        )}

        {hasDropdown && isOpen && (
          <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-[14px] border border-[#ffd01e] bg-white shadow-[0_16px_30px_rgba(16,24,40,0.12)]">
            <div className="max-h-52 overflow-y-auto">
              {options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  dir="rtl"
                  onClick={() => {
                    onChange?.(option);
                    setIsOpen(false);
                  }}
                  className="flex h-11 w-full items-center justify-start rounded-none px-3 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-[rgba(255,208,30,0.12)]"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssetsCatalogEditModal({
  asset,
  open,
  onClose,
  onSave,
}: AssetsCatalogEditModalProps) {
  const [selectedName, setSelectedName] = useState<string>(
    asset?.name ?? "اسكوتر سريع C12",
  );
  const [selectedType, setSelectedType] = useState<string>(
    asset?.type ?? "شاحن",
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    asset?.status ?? "غير نشط",
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    asset?.city ?? "الدمام",
  );
  const [selectedId, setSelectedId] = useState<string>(asset?.id ?? "EV-2402");

  const dropdownOptions = useMemo(() => {
    const unique = (values: string[], fallback: string) =>
      Array.from(new Set([fallback, ...values].filter(Boolean)));

    return {
      names: unique(
        assetsCatalogItems.map((catalogAsset) => catalogAsset.name),
        selectedName,
      ),
      types: unique(
        assetsCatalogItems.map((catalogAsset) => catalogAsset.type),
        selectedType,
      ),
      statuses: unique(
        assetsCatalogItems.map((catalogAsset) => catalogAsset.status),
        selectedStatus,
      ),
      cities: unique(
        assetsCatalogItems.map((catalogAsset) => catalogAsset.city),
        selectedCity,
      ),
    };
  }, [selectedCity, selectedName, selectedStatus, selectedType]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="md:max-w-[700px] lg:max-w-[840px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <div dir="rtl" className="flex flex-col gap-9 md:px-6 py-3">
        <header className="flex items-start justify-between gap-4">
          <div className="text-right">
            <h2 className="text-xl font-medium leading-[30px] text-dark-gray">
              تعديل الأصل
            </h2>
            <p className="mt-1 text-sm font-medium leading-5 text-[#9da4ae]">
              تحديث تفاصيل {selectedName || "الأصل"}
            </p>
          </div>

          <Button
            type="button"
            size="icon"
            onClick={onClose}
            aria-label="إغلاق"
            className="size-12 rounded-[14px] bg-[#ffd01e] text-dark-gray hover:bg-[#f4c400]"
          >
            <X className="size-5" />
          </Button>
        </header>

        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          <Field
            required
            label="اسم الأصل"
            value={selectedName}
            options={dropdownOptions.names}
            onChange={(value) => setSelectedName(value)}
          />
          <Field
            required
            label="السعر"
            value={asset?.price?.replace(/[^\d]/g, "") || "2500"}
            suffix="ر.س"
          />
          <Field
            required
            label="النوع"
            value={selectedType}
            options={dropdownOptions.types}
            onChange={(value) => setSelectedType(value)}
          />
          <Field
            required
            label="الحالة"
            value={selectedStatus}
            options={dropdownOptions.statuses}
            onChange={(value) => setSelectedStatus(value)}
          />
          <Field
            required
            label="المدينة"
            value={selectedCity}
            options={dropdownOptions.cities}
            onChange={(value) => setSelectedCity(value)}
          />
          <Field
            required
            label="الموقع التفصيلي"
            value={asset?.location ?? "جدة - حي الروضة"}
          />
          <Field label="مستوى البطارية (%)" value="92 %" />
          <Field label="عدد الرحلات" value="878" />
          <Field
            className="sm:col-span-2"
            label="معرف الأصل"
            value={selectedId}
            onChange={(value) => setSelectedId(value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            type="button"
            onClick={onSave}
            className="h-16 rounded-[14px] px-6 py-3.5 bg-primary hover:brightness-95 text-base font-medium text-dark-gray"
          >
            حفظ تعديل
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-16 rounded-[14px] bg-neutral-100 px-6 py-3.5 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AssetsCatalogEditModal;

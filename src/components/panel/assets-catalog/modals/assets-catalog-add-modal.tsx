import { useMemo, useRef, useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { assetsCatalogItems } from "@/data";

type AssetsCatalogAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewAssetData) => void;
};

type NewAssetData = {
  name: string;
  price: string;
  type: string;
  status: string;
  city: string;
  location: string;
  battery: string;
  trips: string;
  id: string;
};

type FieldProps = {
  label: string;
  value: string;
  required?: boolean;
  suffix?: string;
  options?: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
};

function Field({
  label,
  value,
  required = false,
  suffix,
  options,
  placeholder,
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
            <input
              type="text"
              dir="rtl"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange?.(e.target.value)}
              className="min-w-0 w-full flex-1 bg-transparent text-right outline-none placeholder:font-normal placeholder:text-gray-300"
            />
            <span className="grid h-8 w-14 shrink-0 place-items-center rounded-[10px] bg-[rgba(255,231,140,0.45)] text-sm font-medium text-dark-gray">
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
            <span
              className={`min-w-0 truncate text-right ${
                !value ? "font-normal text-gray-300" : ""
              }`}
            >
              {value || placeholder}
            </span>
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
            <input
              type="text"
              dir="rtl"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange?.(e.target.value)}
              className="min-w-0 w-full bg-transparent text-right outline-none placeholder:font-normal placeholder:text-gray-300"
            />
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

function AssetsCatalogAddModal({
  open,
  onClose,
  onSave,
}: AssetsCatalogAddModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [battery, setBattery] = useState("");
  const [trips, setTrips] = useState("");
  const [id, setId] = useState("");

  const dropdownOptions = useMemo(() => {
    const unique = (values: string[]) =>
      Array.from(new Set(values.filter(Boolean)));

    return {
      names: unique(assetsCatalogItems.map((a) => a.name)),
      types: unique(assetsCatalogItems.map((a) => a.type)),
      statuses: unique(assetsCatalogItems.map((a) => a.status)),
      cities: unique(assetsCatalogItems.map((a) => a.city)),
    };
  }, []);

  const handleSave = () => {
    onSave({ name, price, type, status, city, location, battery, trips, id });
  };

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
              إضافة أصل
            </h2>
            <p className="mt-1 text-sm font-medium leading-5 text-[#9da4ae]">
              أدخل تفاصيل الأصل الجديد
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
            value={name}
            placeholder="مثال: اسكوتر سريع C12"
            options={dropdownOptions.names}
            onChange={setName}
          />
          <Field
            required
            label="السعر"
            value={price}
            placeholder="0"
            suffix="ر.س"
            onChange={setPrice}
          />
          <Field
            required
            label="النوع"
            value={type}
            placeholder="اختر النوع"
            options={dropdownOptions.types}
            onChange={setType}
          />
          <Field
            required
            label="الحالة"
            value={status}
            placeholder="اختر الحالة"
            options={dropdownOptions.statuses}
            onChange={setStatus}
          />
          <Field
            required
            label="المدينة"
            value={city}
            placeholder="اختر المدينة"
            options={dropdownOptions.cities}
            onChange={setCity}
          />
          <Field
            required
            label="الموقع التفصيلي"
            value={location}
            placeholder="مثال: جدة - حي الروضة"
            onChange={setLocation}
          />
          <Field
            label="مستوى البطارية (%)"
            value={battery}
            placeholder="100"
            onChange={setBattery}
          />
          <Field
            label="عدد الرحلات"
            value={trips}
            placeholder="0"
            onChange={setTrips}
          />
          <Field
            className="sm:col-span-2"
            label="معرف الأصل"
            value={id}
            placeholder="مثال: EV-2402"
            onChange={setId}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            type="button"
            onClick={handleSave}
            className="h-16 rounded-[14px] px-6 py-3.5 bg-primary hover:brightness-95 text-base font-medium text-dark-gray"
          >
            إضافة أصل
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

export default AssetsCatalogAddModal;

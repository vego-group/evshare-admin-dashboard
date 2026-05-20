"use client";

import { ImageIcon } from "lucide-react";

import Modal from "@/components/ui/modal";
import { useCategory } from "@/hooks/api";
import { cn } from "@/lib/utils";

import CategoryDetailsShimmer from "./category-details-shimmer";

type CategoryDetailsModalProps = {
  categoryId: string | null;
  open: boolean;
  onClose: () => void;
};

function CategoryDetailsModal({
  categoryId,
  open,
  onClose,
}: CategoryDetailsModalProps) {
  const { data, isLoading } = useCategory(categoryId);
  const category = data?.data;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="md:max-w-[640px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تفاصيل التصنيف"
      description="عرض بيانات التصنيف المختار"
    >
      <div className="flex flex-col gap-6 p-1 text-right md:p-4">
        {isLoading ? (
          <CategoryDetailsShimmer />
        ) : category ? (
          <>
            <div className="flex flex-col gap-3        rounded-[14px] bg-background p-4">
              {category.image?.url ? (
                <div
                  role="img"
                  aria-label={category.name}
                  className="size-20 rounded-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${category.image.url})` }}
                />
              ) : (
                <div className="grid size-20 place-items-center rounded-2xl bg-primary/15 text-secondary">
                  <ImageIcon className="size-8" />
                </div>
              )}
              <div className="min-w-0 space-y-2">
                <h3 className="max-w-full break-all text-lg font-semibold leading-7 text-secondary sm:break-words">
                  {category.name}
                </h3>
                <StatusBadge active={category.active} />
              </div>
            </div>

            <section className="space-y-3 rounded-[14px] bg-background p-4">
              <DetailRow label="الاسم العربي" value={category.name_ar} />
              <DetailRow label="الاسم الإنجليزي" value={category.name_en} />
              <DetailRow
                label="عدد المنتجات"
                value={formatProductsCount(category.products_count)}
              />
              <DetailRow
                label="تاريخ الإنشاء"
                value={formatDate(category.created_at)}
              />
            </section>
          </>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
            تعذر تحميل تفاصيل التصنيف.
          </div>
        )}
      </div>
    </Modal>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "mt-2 inline-flex h-[34px] w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
        active ? "bg-green-50 text-green-600" : "bg-gray-100 text-dark-gray",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          active ? "bg-green-500" : "bg-gray-400",
        )}
      />
      {active ? "نشط" : "غير نشط"}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-[10px] bg-white px-4 py-3 text-right">
      <span className="text-sm text-gray">{label}</span>
      <span className="min-w-0 max-w-full break-all text-base font-medium text-secondary sm:break-words">
        {value}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatProductsCount(value?: number) {
  return value === undefined ? "-" : String(value);
}

export default CategoryDetailsModal;

"use client";

import { ImageIcon } from "lucide-react";

import Modal from "@/components/ui/modal";
import { useProduct } from "@/hooks/api";
import { cn } from "@/lib/utils";

import ProductDetailsShimmer from "./product-details-shimmer";

type ProductDetailsModalProps = {
  productId: string | null;
  open: boolean;
  onClose: () => void;
};

function ProductDetailsModal({
  productId,
  open,
  onClose,
}: ProductDetailsModalProps) {
  const { data, isLoading } = useProduct(productId);
  const product = data?.data;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="md:max-w-[640px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
      title="تفاصيل المنتج"
      description="عرض بيانات المنتج المختار"
    >
      <div className="flex flex-col gap-6 p-1 text-right md:p-4">
        {isLoading ? (
          <ProductDetailsShimmer />
        ) : product ? (
          <>
            <div className="flex flex-col gap-3 rounded-[14px] bg-background p-4">
              {product.default_image?.url ? (
                <div
                  role="img"
                  aria-label={product.title}
                  className="size-20 rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${product.default_image.url})`,
                  }}
                />
              ) : (
                <div className="grid size-20 place-items-center rounded-2xl bg-primary/15 text-secondary">
                  <ImageIcon className="size-8" />
                </div>
              )}
              <div className="min-w-0 space-y-2">
                <h3 className="max-w-full break-all text-lg font-semibold leading-7 text-secondary sm:break-words">
                  {product.title}
                </h3>
                <StatusBadge active={product.active} />
              </div>
            </div>

            <section className="space-y-3 rounded-[14px] bg-background p-4">
              <DetailRow label="العنوان العربي" value={product.title_ar} />
              <DetailRow label="العنوان الإنجليزي" value={product.title_en} />
              <DetailRow
                label="التصنيف"
                value={product.category?.name ?? "-"}
              />
              <DetailRow label="السعر" value={`${product.price} SAR`} />
              <DetailRow label="الكمية" value={String(product.quantity)} />
              <DetailRow
                label="سعر الاشتراك الشهري"
                value={`${product.monthly_subscription_price} SAR`}
              />
              <DetailRow
                label="السعر المفتوح"
                value={`${product.open_price} SAR`}
              />
              <DetailRow
                label="تاريخ الإنشاء"
                value={formatDate(product.created_at)}
              />
            </section>

            {product.features.length > 0 && (
              <section className="space-y-3 rounded-[14px] bg-background p-4">
                <h4 className="text-sm font-semibold text-secondary">
                  المزايا الرئيسية
                </h4>
                {product.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex flex-col items-start gap-1 rounded-[10px] bg-white px-4 py-3"
                  >
                    <span className="text-sm font-medium text-secondary">
                      {feature.title}
                    </span>
                  </div>
                ))}
              </section>
            )}
          </>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
            تعذر تحميل تفاصيل المنتج.
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

export default ProductDetailsModal;

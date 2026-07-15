"use client";

import { ImageIcon, SaudiRiyal } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/types";

import ProductDetailsShimmer from "../modals/product-details-shimmer";

type Props = {
  product?: ProductDetail;
  isLoading: boolean;
};

export function ProductDetailsContent({ product, isLoading }: Props) {
  if (isLoading) return <ProductDetailsShimmer />;

  if (!product) {
    return (
      <div className="flex min-h-55 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
        تعذر تحميل تفاصيل المنتج.
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 text-right">
      {/* Default image + title */}
      <div className="flex flex-col gap-4 rounded-[14px] bg-background p-4">
        {product.default_image?.url ? (
          <div className="relative h-72 w-full overflow-hidden rounded-2xl">
            <Image
              src={product.default_image.url}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-primary/15 text-secondary">
            <ImageIcon className="size-16" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="w-full break-all text-xl font-bold text-secondary">
            {product.title}
          </h3>
          <StatusBadge active={product.active} />
        </div>
      </div>

      {/* Additional images */}
      {product.images.length > 0 && (
        <section className="space-y-3 rounded-[14px] bg-background p-4">
          <h4 className="text-sm font-semibold text-secondary">
            الصور الإضافية
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="relative h-40 w-full overflow-hidden rounded-xl"
              >
                <Image
                  src={img.url}
                  alt={`صورة ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main info */}
      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">
          البيانات الأساسية
        </h4>
        <DetailRow label="العنوان العربي" value={product.title_ar} />
        <DetailRow label="العنوان الإنجليزي" value={product.title_en} />
        <DetailRow label="التصنيف" value={product.category?.name ?? "-"} />
        <DetailRow
          label="السعر"
          value={
            <span className="inline-flex items-center gap-1" dir="ltr">
              <SaudiRiyal className="size-4 shrink-0" /> {product.price}
            </span>
          }
        />
        <DetailRow label="الكمية" value={String(product.quantity)} />
        <DetailRow
          label="سعر الاشتراك الشهري"
          value={
            <span className="inline-flex items-center gap-1" dir="ltr">
              <SaudiRiyal className="size-4 shrink-0" />{" "}
              {product.monthly_subscription_price}
            </span>
          }
        />
        <DetailRow
          label="سعر فتح القفل"
          value={
            <span className="inline-flex items-center gap-1" dir="ltr">
              <SaudiRiyal className="size-4 shrink-0" /> {product.open_price}
            </span>
          }
        />
        <DetailRow
          label="سعر الدقيقة"
          value={<MoneyValue value={product.price_per_minute} />}
        />
        <DetailRow
          label="سعر الكيلومتر"
          value={<MoneyValue value={product.price_per_km} />}
        />
        <DetailRow
          label="سعر الساعة"
          value={<MoneyValue value={product.price_per_hour} />}
        />
        <DetailRow
          label="سعر اليوم"
          value={<MoneyValue value={product.price_per_day} />}
        />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(product.created_at)}
        />
      </section>

      {/* Descriptions */}
      <section className="space-y-3 rounded-[14px] bg-background p-4">
        <h4 className="text-sm font-semibold text-secondary">الأوصاف</h4>
        <DetailRow label="الوصف العربي" value={product.description_ar} />
        <DetailRow label="الوصف الإنجليزي" value={product.description_en} />
        <DetailRow
          label="الوصف المختصر العربي"
          value={product.small_description_ar}
        />
        <DetailRow
          label="الوصف المختصر الإنجليزي"
          value={product.small_description_en}
        />
      </section>

      {/* Features */}
      {product.features.length > 0 && (
        <section className="space-y-3 rounded-[14px] bg-background p-4">
          <h4 className="text-sm font-semibold text-secondary">
            المزايا الرئيسية
          </h4>
          {product.features.map((feature) => (
            <div
              key={feature.id}
              className="grid md:grid-cols-2 gap-3 rounded-[10px]"
            >
              <div className="flex flex-col gap-1 px-4 py-3 bg-white rounded-[10px]">
                <span className="text-xs text-dark-gray">عربي</span>
                <span className="break-all text-sm font-medium text-secondary">
                  {feature.title_ar}
                </span>
              </div>
              <div
                className="flex flex-col gap-1 px-4 py-3 bg-white rounded-[10px]"
                dir="ltr"
              >
                <span className="text-xs text-dark-gray">الإنجليزي</span>
                <span className="break-all text-sm font-medium text-secondary">
                  {feature.title_en}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function MoneyValue({ value }: { value: ReactNode }) {
  return value === null || value === undefined || value === "" ? (
    "-"
  ) : (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <SaudiRiyal className="size-4 shrink-0" /> {value}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 w-fit items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
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

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-white px-4 py-3 text-right">
      <span className="text-sm text-gray">{label}</span>
      <span className="w-full break-all text-base font-medium text-secondary">
        {value || "-"}
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

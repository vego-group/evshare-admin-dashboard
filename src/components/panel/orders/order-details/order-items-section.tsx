import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { OrderItem } from "@/types";

function OrderItemsSection({ items }: { items: OrderItem[] }) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h2 className="text-base font-semibold text-secondary">المنتجات المطلوبة</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-sm font-semibold leading-6 text-dark-gray">
              <TableHead className="w-[280px]">المنتج</TableHead>
              <TableHead className="w-[120px]">الكمية</TableHead>
              <TableHead className="w-[160px]">سعر الوحدة</TableHead>
              <TableHead className="w-[160px]">الإجمالي</TableHead>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <OrderItemRow key={index} item={item} />
            ))}
          </tbody>
        </table>
      </div>
      {!items.length ? (
        <div className="flex min-h-[120px] items-center justify-center text-sm text-gray">
          لا توجد منتجات في هذا الطلب.
        </div>
      ) : null}
    </section>
  );
}

function OrderItemRow({ item }: { item: OrderItem }) {
  const { product } = item;
  return (
    <tr className="text-sm font-medium text-dark-gray">
      <TableCell>
        <div className="flex items-center gap-3">
          {product.default_image ? (
            <span
              role="img"
              aria-label={product.title}
              className="block size-10 shrink-0 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${product.default_image})` }}
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs text-gray">
              لا صورة
            </span>
          )}
          <span className="line-clamp-2 min-w-0 font-medium text-secondary">{product.title}</span>
        </div>
      </TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell dir="ltr" className="text-right">{item.unit_price.toLocaleString("ar-EG")} ر.س</TableCell>
      <TableCell dir="ltr" className="text-right font-semibold text-secondary">
        {item.total_price.toLocaleString("ar-EG")} ر.س
      </TableCell>
    </tr>
  );
}

function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn("border-b border-primary/15 px-5 py-4", className)}>{children}</th>;
}

function TableCell({
  children,
  className,
  dir,
}: {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <td dir={dir} className={cn("h-16 border-b border-primary/15 px-5 py-3 text-right", className)}>
      {children}
    </td>
  );
}

export default OrderItemsSection;

import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
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
            <span className="relative size-10 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={product.default_image}
                alt={product.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs text-gray">
              لا صورة
            </span>
          )}
          <span className="line-clamp-2 min-w-0 font-medium text-secondary">{product.title}</span>
        </div>
      </TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell dir="ltr" className="text-right">
        <span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4" /> {item.unit_price}</span>
      </TableCell>
      <TableCell dir="ltr" className="text-right font-semibold text-secondary">
        <span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4" /> {item.total_price}</span>
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

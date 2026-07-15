import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/panel/vehicle-operating-pricing/status-badge";
import { cn } from "@/lib/utils";
import type { OrderItem } from "@/types";

function OrderItemsSection({ items }: { items: OrderItem[] }) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h2 className="text-base font-semibold text-secondary">
          المنتجات المطلوبة
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-175 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-sm font-semibold leading-6 text-dark-gray">
              <TableHead className="w-70">المنتج</TableHead>
              <TableHead className="w-30">الكمية</TableHead>
              <TableHead className="w-40">سعر الوحدة</TableHead>
              <TableHead className="w-40">الإجمالي</TableHead>
              <TableHead className="w-60">المركبات</TableHead>
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
        <EmptyState
          description="لا توجد منتجات في هذا الطلب."
          className="min-h-55 rounded-none bg-transparent"
        />
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
          {product.default_image?.url ? (
            <span className="relative size-10 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={product.default_image.url}
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
          <span className="line-clamp-2 min-w-0 font-medium text-secondary">
            {product.title}
          </span>
        </div>
      </TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell dir="ltr" className="text-right">
        <span className="inline-flex items-center gap-1">
          <SaudiRiyal className="size-4" /> {item.unit_price}
        </span>
      </TableCell>
      <TableCell dir="ltr" className="text-right font-semibold text-secondary">
        <span className="inline-flex items-center gap-1">
          <SaudiRiyal className="size-4" /> {item.total_price}
        </span>
      </TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        {item.vehicles.length ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {item.vehicles.map((vehicle) => (
              <span
                key={vehicle.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-100 bg-neutral-50 py-0.5 pl-1 pr-2.5 text-xs font-medium text-secondary"
              >
                {vehicle.label ?? "-"}
                <StatusBadge status={vehicle.status} />
              </span>
            ))}
          </div>
        ) : (
          "-"
        )}
      </TableCell>
    </tr>
  );
}

function TableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("border-b border-primary/15 px-5 py-4", className)}>
      {children}
    </th>
  );
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
    <td
      dir={dir}
      className={cn(
        "h-16 max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3 text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

export default OrderItemsSection;

import { CalendarDays } from "lucide-react";

import type { ProductOrder } from "@/types";

function ProductOrderDateCard({ order }: { order: ProductOrder }) {
  const createdDate = new Intl.DateTimeFormat("ar-EG-u-ca-gregory", {
    dateStyle: "full",
  }).format(new Date(order.createdAt));

  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-[#f9fafb] px-4 py-4 text-right">
      <CalendarDays className="size-5 shrink-0 text-gray" />
      <div>
        <p className="text-base leading-6 text-secondary">{createdDate}</p>
        <p className="text-sm leading-5 text-gray">{order.createdTime}</p>
      </div>
    </div>
  );
}

export default ProductOrderDateCard;

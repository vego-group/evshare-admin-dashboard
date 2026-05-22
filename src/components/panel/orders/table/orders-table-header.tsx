import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function OrdersTableHeader() {
  return (
    <thead>
      <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
        <TableHead className="w-40">رقم الطلب</TableHead>
        <TableHead className="w-45">العميل</TableHead>
        <TableHead className="w-35">العنوان</TableHead>
        <TableHead className="w-37.5">المبلغ الإجمالي</TableHead>
        <TableHead className="w-37.5">الحالة</TableHead>
        <TableHead className="w-37.5">تصنيف الطلب</TableHead>
        <TableHead className="w-45">التاريخ</TableHead>
      </tr>
    </thead>
  );
}

function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th className={cn("border-b border-primary/15 px-5 py-5", className)}>
      {children}
    </th>
  );
}

export default OrdersTableHeader;

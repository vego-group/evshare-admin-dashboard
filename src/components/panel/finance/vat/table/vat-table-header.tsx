import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function VatTableHeader() {
  return (
    <thead>
      <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
        <TableHead className="w-32">المرجع</TableHead>
        <TableHead className="w-40">التاريخ</TableHead>
        <TableHead className="w-24">الفترة</TableHead>
        <TableHead className="w-32">الأساس</TableHead>
        <TableHead className="w-32">الضريبة</TableHead>
        <TableHead className="w-40">تاريخ الاستحقاق</TableHead>
        <TableHead className="w-37.5">الحالة</TableHead>
        <TableHead className="w-40">العميل</TableHead>
        <TableHead className="w-40">المتبقي للفترة</TableHead>
      </tr>
    </thead>
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
    <th className={cn("border-b border-primary/15 px-5 py-5", className)}>
      {children}
    </th>
  );
}

export default VatTableHeader;

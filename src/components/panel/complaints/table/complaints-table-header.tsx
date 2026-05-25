import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function ComplaintsTableHeader() {
  return (
    <thead>
      <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
        <TableHead className="w-[160px]">رقم الشكوى</TableHead>
        <TableHead className="w-[220px]">العنوان</TableHead>
        <TableHead className="w-[180px]">المستخدم</TableHead>
        <TableHead className="w-[156px]">الحالة</TableHead>
        <TableHead className="w-[180px]">تاريخ الإنشاء</TableHead>
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

export default ComplaintsTableHeader;

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function WalletTableHeader() {
  return (
    <thead>
      <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
        <TableHead className="w-40">العنوان</TableHead>
        <TableHead className="w-37.5">إيداع</TableHead>
        <TableHead className="w-37.5">سحب</TableHead>
        <TableHead className="w-37.5">الرصيد</TableHead>
        <TableHead className="w-37.5">الحالة</TableHead>
        <TableHead className="w-32">معرف المستخدم</TableHead>
        <TableHead className="w-45">التاريخ</TableHead>
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

export default WalletTableHeader;

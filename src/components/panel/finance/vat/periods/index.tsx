import { SaudiRiyal } from "lucide-react";

import EmptyState from "@/components/ui/empty-state";
import type { VatPeriod } from "@/types";

import { VatStatusBadge } from "../status-badge";

function VatPeriods({ periods }: { periods: VatPeriod[] }) {
  if (!periods.length) {
    return (
      <EmptyState
        title="لا توجد فترات ضريبية"
        description="لم يتم العثور على فترات ضريبية مطابقة."
        className="min-h-70 rounded-2xl bg-white"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-215 text-right">
        <thead className="bg-primary/8 text-dark-gray">
          <tr>
            <th className="px-5 py-4">الفترة</th>
            <th className="px-5 py-4">عدد الطلبات</th>
            <th className="px-5 py-4">الأساس</th>
            <th className="px-5 py-4">الضريبة</th>
            <th className="px-5 py-4">المسدد</th>
            <th className="px-5 py-4">المتبقي</th>
            <th className="px-5 py-4">تاريخ الاستحقاق</th>
            <th className="px-5 py-4">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period.period} className="border-b border-primary/15 last:border-0">
              <td className="px-5 py-4 font-medium" dir="ltr">
                {period.period}
              </td>
              <td className="px-5 py-4">{period.orders_count}</td>
              <td className="px-5 py-4">
                <AmountCell value={period.base_amount} />
              </td>
              <td className="px-5 py-4">
                <AmountCell value={period.vat_amount} />
              </td>
              <td className="px-5 py-4">
                <AmountCell value={period.vat_paid} />
              </td>
              <td className="px-5 py-4">
                <AmountCell value={period.vat_remaining} />
              </td>
              <td className="px-5 py-4" dir="ltr">
                {period.due_date}
              </td>
              <td className="px-5 py-4">
                <VatStatusBadge status={period.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AmountCell({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <SaudiRiyal className="size-4 shrink-0" />
      {value.toLocaleString("en-US")}
    </span>
  );
}

export default VatPeriods;

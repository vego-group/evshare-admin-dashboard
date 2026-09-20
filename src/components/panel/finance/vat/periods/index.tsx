import MoneyValue from "@/components/ui/money-value";

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
                <AmountCell value={period.base_amount} currency={period.currency} />
              </td>
              <td className="px-5 py-4">
                <AmountCell value={period.vat_amount} currency={period.currency} />
              </td>
              <td className="px-5 py-4">
                <AmountCell value={period.vat_paid} currency={period.currency} />
              </td>
              <td className="px-5 py-4">
                <AmountCell value={period.vat_remaining} currency={period.currency} />
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

function AmountCell({ value, currency }: { value: number; currency?: string }) {
  return <MoneyValue value={value} currency={currency} />;
}

export default VatPeriods;

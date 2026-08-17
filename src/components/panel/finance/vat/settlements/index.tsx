import { Plus, SaudiRiyal } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import type { VatSettlement } from "@/types";

type Props = {
  settlements: VatSettlement[];
  onAdd: () => void;
};

function VatSettlements({ settlements, onAdd }: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-secondary">تسويات الضريبة</h2>
          <p className="text-sm text-gray">سجل بمبالغ ضريبة القيمة المضافة التي تم سدادها</p>
        </div>
        <Button type="button" onClick={onAdd} className="gap-2">
          <Plus className="size-4 shrink-0" />
          تسجيل تسوية
        </Button>
      </div>

      {!settlements.length ? (
        <EmptyState
          title="لا توجد تسويات"
          description="لم يتم تسجيل أي تسويات ضريبية بعد."
          className="min-h-70 rounded-2xl"
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-primary/15">
          <table className="w-full min-w-185 text-right">
            <thead className="bg-primary/8 text-dark-gray">
              <tr>
                <th className="px-5 py-4">الفترة</th>
                <th className="px-5 py-4">المبلغ</th>
                <th className="px-5 py-4">تاريخ السداد</th>
                <th className="px-5 py-4">ملاحظات</th>
                <th className="px-5 py-4">بواسطة</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((settlement) => (
                <tr key={settlement.id} className="border-b border-primary/15 last:border-0">
                  <td className="px-5 py-4 font-medium" dir="ltr">
                    {settlement.period}
                  </td>
                  <td className="px-5 py-4" dir="ltr">
                    <span className="inline-flex items-center gap-1">
                      <SaudiRiyal className="size-4 shrink-0" />
                      {settlement.amount.toLocaleString("en-US")}
                    </span>
                  </td>
                  <td className="px-5 py-4" dir="ltr">
                    {settlement.paid_at}
                  </td>
                  <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                    {settlement.notes || "—"}
                  </td>
                  <td className="px-5 py-4">{settlement.recorded_by?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default VatSettlements;

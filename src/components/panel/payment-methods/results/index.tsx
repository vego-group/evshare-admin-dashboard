import { Pencil } from "lucide-react";

import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "@/types";

type Props = {
  paymentMethods: PaymentMethod[];
  onEdit: (method: PaymentMethod) => void;
};

function PaymentMethodsResults({ paymentMethods, onEdit }: Props) {
  if (!paymentMethods.length) {
    return <EmptyState title="لا توجد طرق دفع" description="لم يتم العثور على طرق دفع مطابقة." className="min-h-[360px] rounded-2xl bg-white" />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-[720px] text-right">
        <thead className="bg-primary/8 text-dark-gray"><tr><th className="px-5 py-4">الاسم بالعربية</th><th className="px-5 py-4">الاسم بالإنجليزية</th><th className="px-5 py-4">الحالة</th><th className="px-5 py-4">الإجراءات</th></tr></thead>
        <tbody>
          {paymentMethods.map((method) => (
            <tr key={method.id} className="border-b border-primary/15 last:border-0">
              <td className="px-5 py-4 font-medium">{method.name_ar}</td>
              <td dir="ltr" className="px-5 py-4 text-right">{method.name_en}</td>
              <td className="px-5 py-4"><StatusBadge active={method.is_active} /></td>
              <td className="px-5 py-4"><div className="flex gap-2">
                <Button size="icon-sm" variant="ghost" aria-label="تعديل" onClick={() => onEdit(method)}><Pencil /></Button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{active ? "نشط" : "غير نشط"}</span>;
}

export default PaymentMethodsResults;

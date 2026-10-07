import { AlertTriangle, Pencil } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import type { PaymentMethod, PaymentMethodAvailability } from "@/types";

type Props = { paymentMethods: PaymentMethod[]; onEdit: (method: PaymentMethod) => void };

export default function PaymentMethodsResults({ paymentMethods, onEdit }: Props) {
  if (!paymentMethods.length) return <EmptyState title="لا توجد طرق دفع" description="لم يتم العثور على طرق دفع مطابقة." className="min-h-90 rounded-2xl bg-white" />;

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-250 text-right">
        <thead className="bg-primary/8 text-dark-gray"><tr>
          <th className="px-5 py-4">طريقة الدفع</th><th className="px-5 py-4">المفتاح</th><th className="px-5 py-4">الاستخدامات</th><th className="px-5 py-4">بوابة الدفع</th><th className="px-5 py-4">الحالة</th><th className="px-5 py-4">الإجراءات</th>
        </tr></thead>
        <tbody>{paymentMethods.map((method) => {
          const gatewayInactive = method.payment_gateway && !method.payment_gateway.is_active;
          return <tr key={method.id} className="border-b border-primary/15 last:border-0">
            <td className="px-5 py-4"><span className="block font-medium">{method.name_ar}</span><span dir="ltr" className="block text-xs text-gray">{method.name_en}</span></td>
            <td dir="ltr" className="px-5 py-4 text-right font-mono text-xs">{method.key}</td>
            <td className="px-5 py-4"><AvailabilityBadges values={method.available_for ?? []} /></td>
            <td className="px-5 py-4"><span className="font-medium">{method.payment_gateway?.name ?? "-"}</span>{gatewayInactive && <span className="mt-1 flex items-center gap-1 text-xs text-amber-700"><AlertTriangle className="size-3.5" />البوابة متوقفة</span>}</td>
            <td className="px-5 py-4"><StatusBadge active={method.is_active} /></td>
            <td className="px-5 py-4"><PermissionGate slug={["Admin Show Payment Methods", "Admin Edit Payment Methods"]} requireAll><Button size="icon-sm" variant="ghost" aria-label="تعديل" onClick={() => onEdit(method)}><Pencil /></Button></PermissionGate></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  );
}

function AvailabilityBadges({ values }: { values: PaymentMethodAvailability[] }) {
  const labels: Record<PaymentMethodAvailability, string> = { orders: "الطلبات", subscriptions: "الاشتراكات" };
  return <div className="flex flex-wrap gap-2">{values.map((value) => <span key={value} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary">{labels[value]}</span>)}</div>;
}

function StatusBadge({ active }: { active: boolean }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{active ? "نشط" : "غير نشط"}</span>;
}

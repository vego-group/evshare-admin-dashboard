import { Pencil } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { PaymentMethod, PaymentMethodAllowedType } from "@/types";

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
      <table className="w-full min-w-[860px] text-right">
        <thead className="bg-primary/8 text-dark-gray"><tr><th className="px-5 py-4">الاسم بالعربية</th><th className="px-5 py-4">الاسم بالإنجليزية</th><th className="px-5 py-4">الأنواع المسموح بها</th><th className="px-5 py-4">الحالة</th><th className="px-5 py-4">الإجراءات</th></tr></thead>
        <tbody>
          {paymentMethods.map((method) => (
            <tr key={method.id} className="border-b border-primary/15 last:border-0">
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 font-medium">{method.name_ar}</td>
              <td dir="ltr" className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 text-right">{method.name_en}</td>
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                <AllowedTypesBadge types={method.allowed_user_types ?? []} />
              </td>
              <td className="px-5 py-4"><StatusBadge active={method.is_active} /></td>
              <td className="px-5 py-4"><div className="flex gap-2">
                <PermissionGate slug={["Admin Show Payment Methods", "Admin Edit Payment Methods"]}>
                  <Button size="icon-sm" variant="ghost" aria-label="تعديل" onClick={() => onEdit(method)}><Pencil /></Button>
                </PermissionGate>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AllowedTypesBadge({ types }: { types: PaymentMethodAllowedType[] }) {
  if (!types.length) return <span className="text-sm text-gray">-</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <span
          key={type}
          className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary"
        >
          {formatAllowedType(type)}
        </span>
      ))}
    </div>
  );
}

function formatAllowedType(type: PaymentMethodAllowedType) {
  if (type === "merchant") return "تاجر";
  if (type === "driver") return "سائق";
  return type;
}

function StatusBadge({ active }: { active: boolean }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{active ? "نشط" : "غير نشط"}</span>;
}

export default PaymentMethodsResults;


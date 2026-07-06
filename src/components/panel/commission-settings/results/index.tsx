import { Pencil, Trash2 } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { CommissionSetting } from "@/types";

type Props = {
  commissionSettings: CommissionSetting[];
  onEdit: (commissionSetting: CommissionSetting) => void;
  onDelete: (commissionSetting: CommissionSetting) => void;
};

function CommissionSettingsResults({ commissionSettings, onEdit, onDelete }: Props) {
  if (!commissionSettings.length) {
    return (
      <EmptyState
        title="لا توجد إعدادات عمولة"
        description="لم يتم العثور على إعدادات عمولة مطابقة."
        className="min-h-[360px] rounded-2xl bg-white"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-[860px] text-right">
        <thead className="bg-primary/8 text-dark-gray">
          <tr>
            <th className="px-5 py-4">الاسم بالعربية</th>
            <th className="px-5 py-4">الاسم بالإنجليزية</th>
            <th className="px-5 py-4">النوع</th>
            <th className="px-5 py-4">القيمة</th>
            <th className="px-5 py-4">الحالة</th>
            <th className="px-5 py-4">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {commissionSettings.map((commissionSetting) => (
            <tr key={commissionSetting.id} className="border-b border-primary/15 last:border-0">
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 font-medium">
                {commissionSetting.name_ar}
              </td>
              <td dir="ltr" className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 text-right">
                {commissionSetting.name_en}
              </td>
              <td className="px-5 py-4">
                <TypeBadge type={commissionSetting.type} />
              </td>
              <td className="px-5 py-4">
                {commissionSetting.amount}
                {commissionSetting.type === "percentage" ? "%" : ""}
              </td>
              <td className="px-5 py-4">
                <StatusBadge active={commissionSetting.is_active} />
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <PermissionGate slug={["View Commission Settings", "Edit Commission Settings"]}>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="تعديل"
                      onClick={() => onEdit(commissionSetting)}
                    >
                      <Pencil />
                    </Button>
                  </PermissionGate>
                  <PermissionGate slug="Delete Commission Settings">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="حذف"
                      onClick={() => onDelete(commissionSetting)}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>
                  </PermissionGate>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypeBadge({ type }: { type: CommissionSetting["type"] }) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary">
      {type === "percentage" ? "نسبة مئوية" : "قيمة ثابتة"}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "نشط" : "غير نشط"}
    </span>
  );
}

export default CommissionSettingsResults;

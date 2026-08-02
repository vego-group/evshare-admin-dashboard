import { Eye, Pencil, Trash2 } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import EmptyState from "@/components/ui/empty-state";
import type { FeatureFlag } from "@/types";

import FeatureFlagStatusBadge from "../status-badge";
import { getFeatureFlagId } from "../utils";
import FeatureFlagActionButton from "./action-button";

type Props = {
  featureFlags: FeatureFlag[];
  onView: (featureFlag: FeatureFlag) => void;
  onEdit: (featureFlag: FeatureFlag) => void;
  onDelete: (featureFlag: FeatureFlag) => void;
};

function FeatureFlagsResults({
  featureFlags,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (!featureFlags.length) {
    return (
      <EmptyState
        title="لا توجد ميزات"
        description="لم يتم العثور على ميزات مطابقة."
        className="min-h-90 rounded-2xl bg-white"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-212.5 text-right">
        <thead className="bg-primary/8 text-dark-gray">
          <tr>
            <th className="px-5 py-4">المفتاح</th>
            <th className="px-5 py-4">الاسم بالعربية</th>
            <th className="px-5 py-4">الاسم بالإنجليزية</th>
            <th className="px-5 py-4">الحالة</th>
            <th className="px-5 py-4">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {featureFlags.map((flag) => (
            <tr
              key={getFeatureFlagId(flag)}
              className="border-b border-primary/15 last:border-0"
            >
              <td
                dir="ltr"
                className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 font-mono text-sm"
              >
                {flag.key}
              </td>
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                {flag.name_ar}
              </td>
              <td
                dir="ltr"
                className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4"
              >
                {flag.name_en}
              </td>
              <td className="px-5 py-4">
                <FeatureFlagStatusBadge isEnabled={flag.is_enabled} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <PermissionGate slug="Admin Show Feature Flags">
                    <FeatureFlagActionButton
                      icon={Eye}
                      label="عرض"
                      onClick={() => onView(flag)}
                      className="bg-blue-50 text-blue-600"
                    />
                  </PermissionGate>
                  <PermissionGate slug="Admin Edit Feature Flags">
                    <FeatureFlagActionButton
                      icon={Pencil}
                      label="تعديل"
                      onClick={() => onEdit(flag)}
                      className="bg-amber-50 text-orange-500"
                    />
                  </PermissionGate>
                  <PermissionGate slug="Admin Delete Feature Flags">
                    <FeatureFlagActionButton
                      icon={Trash2}
                      label="حذف"
                      onClick={() => onDelete(flag)}
                      className="bg-red-50 text-red-500"
                    />
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

export default FeatureFlagsResults;

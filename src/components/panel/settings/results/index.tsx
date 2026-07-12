import { Pencil } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import EmptyState from "@/components/ui/empty-state";
import type { Setting } from "@/types";

import { getSettingLabel, getSettingValueLabel } from "../utils";
import SettingActionButton from "./action-button";

type Props = {
  settings: Setting[];
  onEdit: (setting: Setting) => void;
};

function SettingsResults({ settings, onEdit }: Props) {
  if (!settings.length) {
    return (
      <EmptyState
        title="لا توجد إعدادات"
        description="لم يتم العثور على أي إعدادات."
        className="min-h-90 rounded-2xl bg-white"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-212.5 text-right">
        <thead className="bg-primary/8 text-dark-gray">
          <tr>
            <th className="px-5 py-4">الإعداد</th>
            <th className="px-5 py-4">القيمة</th>
            <th className="px-5 py-4">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr
              key={setting.id}
              className="border-b border-primary/15 last:border-0"
            >
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                {getSettingLabel(setting.setting_name)}
              </td>
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                {getSettingValueLabel(setting.setting_name, setting.setting_value)}
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <PermissionGate slug="Admin Edit Settings">
                    <SettingActionButton
                      label="تعديل"
                      onClick={() => onEdit(setting)}
                    >
                      <Pencil className="size-4" />
                    </SettingActionButton>
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

export default SettingsResults;

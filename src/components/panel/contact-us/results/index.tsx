import { Pencil } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import EmptyState from "@/components/ui/empty-state";
import type { ContactUsSetting } from "@/types";

import { getContactUsLabel } from "../utils";
import ContactUsActionButton from "./action-button";

type Props = {
  settings: ContactUsSetting[];
  onEdit: (setting: ContactUsSetting) => void;
};

function ContactUsResults({ settings, onEdit }: Props) {
  if (!settings.length) {
    return (
      <EmptyState
        title="لا توجد بيانات تواصل"
        description="لم يتم العثور على أي بيانات تواصل."
        className="min-h-90 rounded-2xl bg-white"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-212.5 text-right">
        <thead className="bg-primary/8 text-dark-gray">
          <tr>
            <th className="px-5 py-4">البيان</th>
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
                {getContactUsLabel(setting.setting_name, setting.setting_label)}
              </td>
              <td
                dir="ltr"
                className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 text-right"
              >
                {setting.setting_value}
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <PermissionGate slug="Admin Edit Settings">
                    <ContactUsActionButton
                      label="تعديل"
                      onClick={() => onEdit(setting)}
                    >
                      <Pencil className="size-4 shrink-0" />
                    </ContactUsActionButton>
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

export default ContactUsResults;

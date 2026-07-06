import { Plus } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";

type Props = {
  onAdd: () => void;
};

function CommissionSettingsHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <Header
        title="إعدادات العمولة"
        subtitle="إدارة إعدادات العمولة المطبقة على المعاملات في النظام"
      />
      <PermissionGate slug="Add Commission Settings">
        <Button type="button" onClick={onAdd} className="h-12 gap-2 rounded-[14px] px-5">
          <Plus className="size-5" />
          إضافة عمولة
        </Button>
      </PermissionGate>
    </div>
  );
}

export default CommissionSettingsHeader;

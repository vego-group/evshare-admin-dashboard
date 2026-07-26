import { Plus } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";

type TestAccountsHeaderProps = {
  onAddTestAccount: () => void;
};

function TestAccountsHeader({ onAddTestAccount }: TestAccountsHeaderProps) {
  return (
    <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header title="حسابات الاختبار" subtitle="إدارة الحسابات التجريبية المستخدمة لاختبار الدفع" />

      <PermissionGate slug="Admin Add Test Accounts">
        <Button
          type="button"
          onClick={onAddTestAccount}
          className="h-12 self-start rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90 sm:self-auto"
        >
          <Plus className="size-5" />
          إضافة حساب اختبار
        </Button>
      </PermissionGate>
    </section>
  );
}

export default TestAccountsHeader;

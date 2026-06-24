import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";

function FeatureFlagsHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header
        title="إدارة الميزات"
        subtitle="التحكم في الميزات المتاحة على التطبيق والنظام"
      />
      <Button
        type="button"
        onClick={onAdd}
        className="h-12 w-fit rounded-2xl bg-primary px-6 text-secondary"
      >
        <Plus className="size-5" />
        إضافة ميزة
      </Button>
    </section>
  );
}

export default FeatureFlagsHeader;

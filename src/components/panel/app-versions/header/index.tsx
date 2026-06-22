import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";

type AppVersionsHeaderProps = {
  onAddAppVersion: () => void;
};

function AppVersionsHeader({ onAddAppVersion }: AppVersionsHeaderProps) {
  return (
    <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header
        title="إصدارات التطبيقات"
        subtitle="إدارة إصدارات تطبيقات الجوال والتحديثات المطلوبة"
      />

      <Button
        type="button"
        onClick={onAddAppVersion}
        className="h-12 w-fit rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90"
      >
        <Plus className="size-5" />
        إضافة إصدار
      </Button>
    </section>
  );
}

export default AppVersionsHeader;

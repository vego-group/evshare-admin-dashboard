import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";

type PromosHeaderProps = {
  onAddPromo: () => void;
};

function PromosHeader({ onAddPromo }: PromosHeaderProps) {
  return (
    <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header title="أكواد الخصم" subtitle="إدارة ومتابعة أكواد الخصم الترويجية" />

      <Button
        type="button"
        onClick={onAddPromo}
        className="h-12 self-start rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90 sm:self-auto"
      >
        <Plus className="size-5" />
        إضافة كود خصم
      </Button>
    </section>
  );
}

export default PromosHeader;

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import PermissionGate from "@/components/permission-gate";

type ShippingCompaniesHeaderProps = {
  onAddShippingCompany: () => void;
};

function ShippingCompaniesHeader({
  onAddShippingCompany,
}: ShippingCompaniesHeaderProps) {
  return (
    <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header
        title="شركات الشحن"
        subtitle="إدارة الناقلين وأسعار وحدود الشحن"
      />

      <PermissionGate slug="Admin Add Shipping Companies"><Button
        type="button"
        onClick={onAddShippingCompany}
        className="h-12 self-start rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90 sm:self-auto"
      >
        <Plus className="size-5 shrink-0" />
        إضافة شركة شحن
      </Button></PermissionGate>
    </section>
  );
}

export default ShippingCompaniesHeader;

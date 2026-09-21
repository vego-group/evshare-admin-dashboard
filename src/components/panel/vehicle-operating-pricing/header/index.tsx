import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import PermissionGate from "@/components/permission-gate";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";

function VehicleOperatingPricingHeader({ onOpenMap }: { onOpenMap: () => void }) {
  return (
    <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Header
        title="تشغيل وتسعير المركبات"
        subtitle="مراجعة العقود وتحديث أسعار تشغيل المركبات"
      />
      <div className="flex items-center gap-3 self-start sm:self-auto"><PermissionGate slug="Admin Add Vehicles"><Button asChild className="h-12 rounded-2xl"><Link href="/vehicle-operating-pricing/create"><Plus className="size-4" /> إضافة مركبة</Link></Button></PermissionGate><Button
        type="button"
        onClick={onOpenMap}
        className="h-12 self-start rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90 sm:self-auto"
      >
        <MapPin className="size-5 shrink-0" />
        خريطة الأسطول
      </Button></div>
    </section>
  );
}

export default VehicleOperatingPricingHeader;

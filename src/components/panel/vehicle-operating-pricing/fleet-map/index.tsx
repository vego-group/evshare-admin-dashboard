"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "@/components/ui/header";
import { useAllVehicles } from "@/hooks/api";

import VehicleFleetMap from "./vehicle-fleet-map";
import VehicleMapSidebar from "./vehicle-map-sidebar";

const FLEET_MAP_PAGE_SIZE = 100;

function VehicleFleetMapPage() {
  const router = useRouter();
  const { data, isLoading } = useAllVehicles({ limit: FLEET_MAP_PAGE_SIZE });
  const vehicles = (data ?? []).filter((vehicle) => vehicle.location);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/vehicle-operating-pricing")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة"
        >
          <ArrowRight className="size-5" />
        </button>
        <Header
          title="خريطة الأسطول"
          subtitle="مواقع كل المركبات المعروفة على الخريطة"
        />
      </div>

      {isLoading ? (
        <p className="p-6 text-center text-sm text-gray">جارٍ التحميل...</p>
      ) : (
        <div className="flex h-[70vh] min-h-[420px] flex-col gap-4 lg:h-[75vh] lg:flex-row">
          <div className="order-2 min-h-64 flex-1 lg:order-1 lg:min-h-0">
            <VehicleFleetMap
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />
          </div>
          <div className="order-1 h-56 shrink-0 lg:order-2 lg:h-auto lg:w-80">
            <VehicleMapSidebar
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleFleetMapPage;

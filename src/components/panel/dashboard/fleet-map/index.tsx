import { BatteryCharging, MapPinned } from "lucide-react";

import { fleetMarkers } from "@/data/dashboard";
import { DashboardSectionCard } from "../shared";
import { cn } from "@/lib/utils";

// بيحمي الـ markers من الـ edges — min 8% من اليسار، max 88% عشان الـ marker متطلعش برا
function clampPosition(value: string, min = "8%", max = "88%") {
  return `clamp(${min}, ${value}, ${max})`;
}

function FleetMapSection() {
  return (
    <DashboardSectionCard className="min-w-0 p-4 sm:p-6">
      <div className="space-y-1 text-right">
        <h2 className="text-lg font-semibold text-secondary sm:text-2xl">
          تتبع المنتجات
        </h2>
        <p className="text-xs font-medium text-gray sm:text-sm">
          حالة المنتجات في الخريطة وأماكن تواجدها
        </p>
      </div>

      <div
        className="relative mt-5 overflow-hidden rounded-4xl border border-primary/10 bg-[#eef3e8] sm:mt-8 sm:rounded-[22px]"
        style={{ isolation: "isolate" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,147,95,0.12),transparent_28%),radial-gradient(circle_at_74%_60%,rgba(255,206,39,0.2),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.45),rgba(255,255,255,0.2))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(108,115,127,0.08)_1px,transparent_1px),linear-gradient(rgba(108,115,127,0.08)_1px,transparent_1px)] bg-size-[54px_54px]" />

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full opacity-55"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 58 C15 48, 24 48, 36 58 S58 74, 74 62 88 36, 100 44"
            fill="none"
            stroke="#cfd8ca"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M10 18 C22 28, 28 40, 34 52 S52 74, 68 70 88 52, 96 58"
            fill="none"
            stroke="#d9e2d3"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M3 32 C18 26, 33 28, 48 38 S74 48, 92 34"
            fill="none"
            stroke="#d9e2d3"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative aspect-[1.08/1] min-h-62.5 sm:aspect-[1.4/1] sm:min-h-70 lg:aspect-[1.68/1]">
          {fleetMarkers.map((marker) => (
            <div
              key={marker.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: clampPosition(marker.x),
                top: clampPosition(marker.y, "14%", "84%"),
              }}
            >
              <div className="relative flex flex-col items-center gap-1 sm:gap-1.5">
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-semibold shadow-sm sm:px-2 sm:py-1 sm:text-[10px]",
                    marker.accent === "green"
                      ? "bg-green text-white"
                      : "bg-primary text-secondary",
                  )}
                >
                  {marker.charge}
                </span>

                <div
                  className={cn(
                    "grid size-8 place-items-center rounded-full border-2 border-white shadow-lg sm:size-11",
                    marker.accent === "green"
                      ? "bg-green/15 text-green"
                      : "bg-primary/25 text-secondary",
                  )}
                >
                  <BatteryCharging className="size-4 sm:size-5" />
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-2 left-5 inline-flex max-w-[calc(100%-1.5rem)] items-center justify-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-gray shadow-sm sm:bottom-4 sm:left-4 sm:max-w-none sm:gap-2 sm:px-3 sm:py-2 sm:text-xs">
            <MapPinned className="size-3.5 sm:size-4 text-primary" />
            خريطة توزيع المركبات
          </div>
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export default FleetMapSection;

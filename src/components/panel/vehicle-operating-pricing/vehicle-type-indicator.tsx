import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  vehicleTypeLabel,
  vehicleTypeSourceLabel,
} from "@/lib/utils/vehicle-type";
import type { VehicleType, VehicleTypeSource } from "@/types";

type Props = {
  type: VehicleType;
  source: VehicleTypeSource;
  showSource?: boolean;
  className?: string;
};

export default function VehicleTypeIndicator({
  type,
  source,
  showSource = false,
  className,
}: Props) {
  const isInferred = source === "inferred";

  return (
    <span
      className={cn("inline-flex min-w-0 flex-wrap items-center gap-1.5", className)}
      title={
        isInferred
          ? "تم تخمين النوع لعدم تحديده على المركبة أو المنتج أو التصنيف"
          : vehicleTypeSourceLabel(source)
      }
    >
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          isInferred
            ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
            : "bg-primary/10 text-secondary",
        )}
      >
        {isInferred && <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />}
        {vehicleTypeLabel(type)}
      </span>
      {showSource && (
        <span className={cn("text-xs", isInferred ? "font-medium text-amber-700" : "text-gray")}>
          {vehicleTypeSourceLabel(source)}
        </span>
      )}
    </span>
  );
}

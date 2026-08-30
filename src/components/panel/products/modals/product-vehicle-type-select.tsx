"use client";

import { useCategory } from "@/hooks/api";
import { vehicleTypeLabel } from "@/lib/utils/vehicle-type";
import type { ProductFormValues } from "@/schemas/products";
import type { VehicleType } from "@/types";
import type { UseFormSetValue } from "react-hook-form";
import VehicleTypeDropdown from "@/components/ui/vehicle-type-dropdown";

type Props = {
  categoryId: string;
  value: VehicleType | null;
  setValue: UseFormSetValue<ProductFormValues>;
};

export default function ProductVehicleTypeSelect({ categoryId, value, setValue }: Props) {
  const { data } = useCategory(categoryId || null);
  const inheritedType = data?.data.vehicle_type;
  const inheritedLabel = inheritedType
    ? `يرث من التصنيف (${vehicleTypeLabel(inheritedType)})`
    : "يرث من التصنيف";

  return (
    <VehicleTypeDropdown
      value={value}
      nullLabel={inheritedLabel}
      onChange={(nextValue) =>
        setValue("vehicle_type", nextValue, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    />
  );
}

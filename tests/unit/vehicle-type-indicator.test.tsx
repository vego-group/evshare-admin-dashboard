import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import VehicleTypeIndicator from "@/components/panel/vehicle-operating-pricing/vehicle-type-indicator";
import {
  vehicleTypeLabel,
  vehicleTypeSourceLabel,
} from "@/lib/utils/vehicle-type";

describe("vehicle type presentation", () => {
  it.each([
    ["bike", "دراجة"],
    ["scooter", "سكوتر"],
    ["car", "سيارة"],
  ] as const)("labels the %s type", (type, label) => {
    expect(vehicleTypeLabel(type)).toBe(label);
  });

  it("makes an inferred type visually explicit", () => {
    render(
      <VehicleTypeIndicator
        type="scooter"
        source="inferred"
        showSource
      />,
    );

    expect(screen.getByText("سكوتر")).toBeInTheDocument();
    expect(screen.getByText("مستنتج تلقائياً")).toBeInTheDocument();
    expect(screen.getByTitle(/تم تخمين النوع/)).toBeInTheDocument();
  });

  it.each([
    ["vehicle", "محدد على المركبة"],
    ["product", "موروث من المنتج"],
    ["category", "موروث من التصنيف"],
    ["inferred", "مستنتج تلقائياً"],
  ] as const)("labels the %s source", (source, label) => {
    expect(vehicleTypeSourceLabel(source)).toBe(label);
  });
});

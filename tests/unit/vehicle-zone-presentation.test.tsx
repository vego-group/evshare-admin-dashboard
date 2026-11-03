import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ZoneDeleteConfirmModal from "@/components/panel/vehicle-operating-pricing/modals/zone-delete-confirm-modal";
import ZoneTypeBadge from "@/components/panel/vehicle-operating-pricing/zone-type-badge";
import type { VehicleZone } from "@/types";

const activeRestrictedZone: VehicleZone = {
  id: "zone-1",
  name_ar: "منطقة المطار",
  name_en: "Airport Zone",
  type: "restricted",
  speed_limit: null,
  coordinates: "[]",
  is_active: true,
};

describe("vehicle zone presentation", () => {
  it("shows a slow zone's speed limit with its semantic label", () => {
    render(<ZoneTypeBadge type="slow" speedLimit={20} />);

    expect(screen.getByText("بطيئة")).toBeInTheDocument();
    expect(screen.getByText(/20 km\/h/)).toBeInTheDocument();
  });

  it("explains the live-trip impact before deleting an active zone", () => {
    render(
      <ZoneDeleteConfirmModal
        open
        zone={activeRestrictedZone}
        isDeleting={false}
        onClose={() => undefined}
        onConfirm={() => undefined}
      />,
    );

    expect(screen.getByText("منطقة المطار")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("نقطة GPS دقيقة تالية");
  });

  it("does not claim a live-trip impact for an already inactive zone", () => {
    render(
      <ZoneDeleteConfirmModal
        open
        zone={{ ...activeRestrictedZone, is_active: false }}
        isDeleting={false}
        onClose={() => undefined}
        onConfirm={() => undefined}
      />,
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TripZoneStatus from "@/components/panel/trips/trip-zone-status";
import type { TripListItem } from "@/types";

function tripWithZone(
  zoneType?: TripListItem["zone_type"],
  zoneId: string | null = "zone-1",
) {
  return {
    zone_id: zoneId,
    zone_type: zoneType,
    zone_changed_at: "2026-10-19T08:00:00Z",
  } as TripListItem;
}

describe("TripZoneStatus", () => {
  it.each([
    ["normal", "منطقة تشغيل عادية"],
    ["slow", "منطقة سرعة منخفضة"],
    ["restricted", "منطقة محظورة"],
  ] as const)("renders the server-authoritative %s zone", (type, label) => {
    render(<TripZoneStatus trip={tripWithZone(type)} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("uses an alert for warning zones", () => {
    render(<TripZoneStatus trip={tripWithZone("restricted")} />);

    expect(screen.getByRole("alert")).toHaveTextContent("القيادة غير مسموح بها");
  });

  it("renders nothing when the admin API omits zone state", () => {
    const { container } = render(
      <TripZoneStatus trip={tripWithZone(undefined, null)} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

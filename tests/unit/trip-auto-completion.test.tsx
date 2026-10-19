import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { tripEndSourceLabel } from "@/components/panel/trips/utils";
import TripBasicInfo from "@/components/panel/trips/view-trip/trip-basic-info";
import type { TripListItem } from "@/types";

vi.mock("@/components/panel/trips/money-value", () => ({
  default: ({ value }: { value: unknown }) => <span>{String(value)}</span>,
}));

const completedTrip = {
  id: "trip-1",
  status: "completed",
  price: 12,
  vehicle_type: "scooter",
  pickup_location: { latitude: 30, longitude: 31 },
  drop_off_location: null,
  live_location: null,
  route: [],
  date_time: {
    start: "2026-10-19T08:00:00Z",
    end: "2026-10-19T08:10:00Z",
  },
  timeline: [],
  driver: { id: "driver-1", name: "Driver" },
  vehicle: {
    id: "vehicle-1",
    label: "Scooter 1",
    status: "active",
    product: null,
    iot_device_id: "iot-1",
    battery_percentage: 80,
  },
  end_source: "lock_closed",
  lock_closed_at: "2026-10-19T08:10:00Z",
} as TripListItem;

describe("trip lock-close completion", () => {
  it.each([
    ["rider", "السائق"],
    ["lock_closed", "إغلاق القفل تلقائياً"],
    ["lock_reconciliation", "مطابقة حالة القفل تلقائياً"],
    ["auto_stop", "الإيقاف التلقائي لنفاد الرصيد"],
    ["admin", "المشرف"],
  ] as const)("labels the %s completion source", (source, label) => {
    expect(tripEndSourceLabel(source)).toBe(label);
  });

  it("shows lock-close provenance and its billing explanation", () => {
    render(<TripBasicInfo trip={completedTrip} />);

    expect(screen.getByText("إغلاق القفل تلقائياً")).toBeInTheDocument();
    expect(screen.getByText("وقت إغلاق القفل")).toBeInTheDocument();
    expect(
      screen.getByText(/توقفت الفوترة عند وقت الإغلاق/),
    ).toBeInTheDocument();
  });

  it("does not invent completion provenance when the API omits it", () => {
    const legacyTrip = {
      ...completedTrip,
      end_source: undefined,
      lock_closed_at: undefined,
    };

    render(<TripBasicInfo trip={legacyTrip} />);

    expect(screen.queryByText("مصدر إنهاء الرحلة")).not.toBeInTheDocument();
    expect(screen.queryByText("وقت إغلاق القفل")).not.toBeInTheDocument();
  });
});

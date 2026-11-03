import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/panel/trips/money-value", () => ({
  default: ({ value, currency }: { value: unknown; currency?: string }) => (
    <span>{String(value ?? "-")} {currency}</span>
  ),
}));

import TripBillingDetails from "@/components/panel/trips/view-trip/trip-billing-details";
import type { TripListItem } from "@/types";

const baseTrip = {
  id: "trip-billing-1",
  status: "in_progress",
  price: 18,
  commission: 2,
  distance: 4.2,
  vehicle_type: "scooter",
  pickup_location: { latitude: 24.71, longitude: 46.67 },
  drop_off_location: null,
  live_location: { latitude: 24.72, longitude: 46.68 },
  route: [],
  date_time: { start: "2026-11-03T10:00:00Z", end: null },
  timeline: [],
  currency: "SAR",
  open_price: 5,
  price_per_minute: 2.5,
  billing_increment_seconds: 60,
  minimum_charge: 5,
  pricing_locked_at: "2026-11-03T10:00:00Z",
  driver: { id: "driver-1", name: "Driver" },
  vehicle: {
    id: "vehicle-1",
    label: "Scooter 1",
    status: "in_use",
    product: null,
    iot_device_id: "iot-1",
    battery_percentage: 80,
    price_per_minute: 2.5,
    price_per_km: 99,
  },
} satisfies TripListItem;

describe("trip billing details", () => {
  it("labels active pricing as server-authoritative and excludes distance billing", () => {
    render(<TripBillingDetails trip={baseTrip} />);

    expect(screen.getByText("السعر حتى آخر تحديث موقع")).toBeInTheDocument();
    expect(screen.getByText("غير محتسبة في سعر الرحلة")).toBeInTheDocument();
    expect(screen.queryByText("سعر الكيلومتر")).not.toBeInTheDocument();
    expect(screen.getByText(/ليست عداداً محلياً/)).toBeInTheDocument();
  });

  it("explains idempotent settlement for a completed trip", () => {
    render(
      <TripBillingDetails
        trip={{
          ...baseTrip,
          status: "completed",
          date_time: {
            ...baseTrip.date_time,
            end: "2026-11-03T10:05:00Z",
          },
          cost_breakdown: {
            unlock_fee: 5,
            time_cost: 13,
            other_charges: 0,
            vat_amount: 0,
            total: 18,
          },
        }}
      />,
    );

    expect(screen.getByText("السعر النهائي")).toBeInTheDocument();
    expect(screen.getByText(/لا يؤدي تكرار طلب الإنهاء إلى خصم جديد/)).toBeInTheDocument();
  });
});

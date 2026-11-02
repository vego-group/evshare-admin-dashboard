import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VehicleOperationalStatus } from "@/components/panel/vehicle-operating-pricing/vehicle-operational-status";
import type { VehicleListItem } from "@/types";

function vehicle(
  overrides: Partial<VehicleListItem> = {},
): VehicleListItem {
  return {
    id: "vehicle-1",
    status: "active",
    rental_availability: {
      status: "unavailable",
      available: false,
      reason: "lock_offline",
      message: "قفل المركبة غير متصل",
    },
    lock_id: "lock-1",
    lock: {
      id: "lock-1",
      device_id: "3fcbff96-04c0-4803-a24f-6f6aba32f8e7",
      status: "locked",
      connectivity: "offline",
      is_online: false,
      battery_percentage: 77,
      last_seen_at: null,
      notes: null,
      last_lock_date: null,
      last_unlock_date: null,
      location: null,
      last_location_date: null,
      location_is_stale: false,
      vehicle: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
    ...overrides,
  } as VehicleListItem;
}

describe("VehicleOperationalStatus", () => {
  it("renders lifecycle, lock, connectivity, and backend availability separately", () => {
    render(<VehicleOperationalStatus vehicle={vehicle()} />);

    expect(screen.getByText("حالة المركبة")).toBeInTheDocument();
    expect(screen.getByText("نشط")).toBeInTheDocument();
    expect(screen.getByText("مقفل")).toBeInTheDocument();
    expect(screen.getByText("غير متصل")).toBeInTheDocument();
    expect(screen.getByText("قفل المركبة غير متصل")).toBeInTheDocument();
  });

  it("shows an unbound lock without deriving a different availability verdict", () => {
    render(
      <VehicleOperationalStatus
        vehicle={vehicle({
          lock_id: null,
          lock: null,
          rental_availability: {
            status: "unavailable",
            available: false,
            reason: "no_lock_bound",
            message: "لا يوجد قفل مربوط",
          },
        })}
      />,
    );

    expect(screen.getByText("غير مربوط")).toBeInTheDocument();
    expect(screen.getByText("لا يوجد قفل")).toBeInTheDocument();
    expect(screen.getByText("لا يوجد قفل مربوط")).toBeInTheDocument();
  });
});

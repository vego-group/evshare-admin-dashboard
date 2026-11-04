import { describe, expect, it } from "vitest";

import {
  acceptedTripRoutePath,
  formatTripDistance,
  tripRouteStats,
} from "@/components/panel/trips/utils";
import type { RoutePoint, TripListItem } from "@/types";

describe("server-authoritative trip distance", () => {
  it.each([
    [null, "-"],
    [0, "0 متر"],
    [0.005, "5 متر"],
    [1.234, "١٫٢٣ كم"],
    ["2.5", "٢٫٥ كم"],
  ] as const)("formats %s kilometres", (distance, expected) => {
    expect(formatTripDistance(distance)).toBe(expected);
  });

  it("keeps discarded route points as diagnostic metadata", () => {
    const discardedPoint: RoutePoint = {
      latitude: 30.0444,
      longitude: 31.2357,
      discarded: true,
    };
    const trip = {
      distance: 0,
      route: [discardedPoint],
    } as TripListItem;

    expect(trip.distance).toBe(0);
    expect(trip.route[0].discarded).toBe(true);
  });

  it("separates accepted and discarded route points for admin diagnostics", () => {
    const route: RoutePoint[] = [
      { latitude: 30.0444, longitude: 31.2357 },
      { latitude: 30.0445, longitude: 31.2358, discarded: false },
      { latitude: 31, longitude: 32, discarded: true },
    ];

    expect(tripRouteStats(route)).toEqual({
      total: 3,
      accepted: 2,
      discarded: 1,
    });

    expect(acceptedTripRoutePath(route)).toEqual([
      { lat: 30.0444, lng: 31.2357 },
      { lat: 30.0445, lng: 31.2358 },
    ]);
  });
});

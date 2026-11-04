"use client";

import { Polyline } from "@vis.gl/react-google-maps";

import type { RoutePoint } from "@/types";
import { acceptedTripRoutePath } from "../utils";

function TripRoutePolyline({ route }: { route: RoutePoint[] }) {
  const path = acceptedTripRoutePath(route);

  if (!path.length) return null;

  return (
    <Polyline
      path={path}
      strokeColor="#2563eb"
      strokeOpacity={0.8}
      strokeWeight={3}
    />
  );
}

export default TripRoutePolyline;

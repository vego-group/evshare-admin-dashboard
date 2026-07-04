"use client";

import { Polyline } from "@vis.gl/react-google-maps";

import type { RoutePoint } from "@/types";

function TripRoutePolyline({ route }: { route: RoutePoint[] }) {
  const path = route
    .map((point) => ({ lat: Number(point.latitude), lng: Number(point.longitude) }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

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

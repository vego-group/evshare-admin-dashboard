"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

import type { TripListItem } from "@/types";
import TripRoutePolyline from "../active-trips/trip-route-polyline";

function toLatLng(coordinate: { latitude: number | string; longitude: number | string } | null) {
  if (!coordinate) return null;
  const lat = Number(coordinate.latitude);
  const lng = Number(coordinate.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function TripRouteMap({ trip }: { trip: TripListItem }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const pickup = toLatLng(trip.pickup_location);
  const dropoff = toLatLng(trip.drop_off_location);
  const live = toLatLng(trip.live_location);
  const center = live ?? pickup ?? dropoff;

  if (!apiKey) {
    return (
      <p className="grid h-full place-items-center rounded-2xl border border-dashed border-primary/30 p-4 text-center text-sm text-dark-gray">
        لم يتم إعداد مفتاح خرائط جوجل (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      </p>
    );
  }

  if (!center) {
    return (
      <p className="grid h-full place-items-center rounded-2xl border border-dashed border-primary/20 p-4 text-center text-sm text-gray">
        لا تتوفر بيانات موقع لهذه الرحلة
      </p>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-primary/15">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <TripRoutePolyline route={trip.route} />
          {pickup && <Marker position={pickup} title="نقطة الانطلاق" />}
          {dropoff && <Marker position={dropoff} title="نقطة الوصول" />}
          {live && <Marker position={live} title="الموقع الحالي" />}
        </Map>
      </APIProvider>
    </div>
  );
}

export default TripRouteMap;

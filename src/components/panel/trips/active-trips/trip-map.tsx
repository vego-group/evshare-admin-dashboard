"use client";

import { useEffect } from "react";
import { APIProvider, InfoWindow, Map, useMap } from "@vis.gl/react-google-maps";

import { useUserLocation } from "@/hooks";
import type { TripListItem } from "@/types";
import { tripMapLatLng } from "../utils";
import TripInfoContent from "./trip-info-content";
import TripMarker from "./trip-marker";
import TripRoutePolyline from "./trip-route-polyline";

const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 };
const FOCUS_ZOOM = 15;

function FocusSelectedTrip({ trip }: { trip: TripListItem | null }) {
  const map = useMap();

  useEffect(() => {
    const position = trip ? tripMapLatLng(trip) : null;
    if (!map || !position) return;
    map.panTo(position);
    if ((map.getZoom() ?? 0) < FOCUS_ZOOM) map.setZoom(FOCUS_ZOOM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, trip?.id, trip?.live_location?.latitude, trip?.live_location?.longitude, trip?.pickup_location.latitude, trip?.pickup_location.longitude]);

  return null;
}

function TripMap({
  trips,
  selectedTripId,
  onSelectTrip,
  onCancelTrip,
  onEndTrip,
}: {
  trips: TripListItem[];
  selectedTripId: string | null;
  onSelectTrip: (tripId: string | null) => void;
  onCancelTrip: (trip: TripListItem) => void;
  onEndTrip: (trip: TripListItem) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const userLocation = useUserLocation();
  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) ?? null;
  const selectedPosition = selectedTrip ? tripMapLatLng(selectedTrip) : null;
  const initialCenter = (trips[0] ? tripMapLatLng(trips[0]) : null) ?? DEFAULT_CENTER;

  if (!apiKey) {
    return (
      <p className="grid h-full place-items-center rounded-[12px] border border-dashed border-primary/30 p-4 text-center text-sm text-dark-gray">
        لم يتم إعداد مفتاح خرائط جوجل (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      </p>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-[12px] border border-primary/15">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={initialCenter}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={() => onSelectTrip(null)}
        >
          {trips.map((trip) => (
            <TripMarker key={trip.id} trip={trip} isSelected={trip.id === selectedTripId} onSelect={() => onSelectTrip(trip.id)} />
          ))}
          {selectedTrip && <TripRoutePolyline route={selectedTrip.route} />}
          <FocusSelectedTrip trip={selectedTrip} />
          {selectedTrip && selectedPosition && (
            <InfoWindow position={selectedPosition} onCloseClick={() => onSelectTrip(null)} pixelOffset={[0, -38]}>
              <TripInfoContent trip={selectedTrip} userLocation={userLocation} onCancelTrip={onCancelTrip} onEndTrip={onEndTrip} />
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

export default TripMap;

"use client";

import { useEffect } from "react";
import {
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";

import { useUserLocation } from "@/hooks";
import type { VehicleListItem } from "@/types";
import VehicleInfoContent from "./vehicle-info-content";
import VehicleMarker from "./vehicle-marker";
import { vehicleMapLocation } from "../utils";

const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 };
const FOCUS_ZOOM = 15;

function FocusSelectedVehicle({
  vehicle,
}: {
  vehicle: VehicleListItem | null;
}) {
  const map = useMap();

  useEffect(() => {
    const location = vehicle ? vehicleMapLocation(vehicle) : null;
    if (!map || !location) return;
    map.panTo({
      lat: Number(location.latitude),
      lng: Number(location.longitude),
    });
    if ((map.getZoom() ?? 0) < FOCUS_ZOOM) map.setZoom(FOCUS_ZOOM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    map,
    vehicle?.id,
    vehicle?.current_location?.latitude,
    vehicle?.current_location?.longitude,
    vehicle?.location?.latitude,
    vehicle?.location?.longitude,
  ]);

  return null;
}

function VehicleFleetMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: {
  vehicles: VehicleListItem[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string | null) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const userLocation = useUserLocation();
  const selected =
    vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null;
  const firstLocation = vehicles[0] ? vehicleMapLocation(vehicles[0]) : null;
  const initialCenter = firstLocation
    ? {
        lat: Number(firstLocation.latitude),
        lng: Number(firstLocation.longitude),
      }
    : DEFAULT_CENTER;

  if (!apiKey) {
    return (
      <p className="grid h-full place-items-center rounded-2xl border border-dashed border-primary/30 p-4 text-center text-sm text-dark-gray">
        لم يتم إعداد مفتاح خرائط جوجل (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      </p>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-primary/15">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={initialCenter}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={() => onSelectVehicle(null)}
        >
          {vehicles.map((vehicle) => (
            <VehicleMarker
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={vehicle.id === selectedVehicleId}
              onSelect={() => onSelectVehicle(vehicle.id)}
            />
          ))}
          <FocusSelectedVehicle vehicle={selected} />
          {selected && vehicleMapLocation(selected) && (
            <InfoWindow
              position={{
                lat: Number(vehicleMapLocation(selected)!.latitude),
                lng: Number(vehicleMapLocation(selected)!.longitude),
              }}
              onCloseClick={() => onSelectVehicle(null)}
              pixelOffset={[0, -38]}
            >
              <VehicleInfoContent
                vehicle={selected}
                userLocation={userLocation}
              />
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

export default VehicleFleetMap;

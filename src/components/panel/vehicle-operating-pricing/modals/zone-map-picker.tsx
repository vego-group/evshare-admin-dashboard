"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 };

function parseWkt(wkt: string): google.maps.LatLngLiteral[] {
  const match = /POLYGON\s*\(\(([^)]+)\)\)/i.exec(wkt);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((pair) => pair.trim().split(/\s+/).map(Number))
    .filter(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat))
    .map(([lng, lat]) => ({ lat, lng }));
}

function toWkt(path: google.maps.LatLngLiteral[]): string {
  if (!path.length) return "";
  const ring = [...path, path[0]]
    .map((point) => `${point.lng} ${point.lat}`)
    .join(", ");
  return `POLYGON((${ring}))`;
}

// Google removed the drawing library's DrawingManager from the Maps JS API (v3.65+), so the
// polygon is built manually here: clicking the map appends vertices to an editable Polygon.
function PolygonDrawer({
  initialPath,
  onChange,
  isDrawing,
  clearSignal,
}: {
  initialPath: google.maps.LatLngLiteral[];
  onChange: (coordinates: string) => void;
  isDrawing: boolean;
  clearSignal: number;
}) {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const hasDrawnInitialRef = useRef(false);

  const emitChange = useCallback(() => {
    const polygon = polygonRef.current;
    onChange(
      polygon
        ? toWkt(
            polygon
              .getPath()
              .getArray()
              .map((point) => point.toJSON()),
          )
        : "",
    );
  }, [onChange]);

  const attachPathListeners = useCallback(
    (polygon: google.maps.Polygon) => {
      const path = polygon.getPath();
      google.maps.event.addListener(path, "insert_at", emitChange);
      google.maps.event.addListener(path, "set_at", emitChange);
      google.maps.event.addListener(path, "remove_at", emitChange);
    },
    [emitChange],
  );

  // Draws the zone's existing boundary once the map instance and coordinates are both
  // ready. `initialPath` may arrive a render or two after `map` (e.g. while the vehicle's
  // full detail record is still loading), so this re-checks on every render instead of
  // only reacting to `map` — `hasDrawnInitialRef` keeps it a one-time draw once it succeeds.
  useEffect(() => {
    if (!map || !initialPath.length || hasDrawnInitialRef.current) return;
    hasDrawnInitialRef.current = true;
    const polygon = new google.maps.Polygon({
      map,
      paths: initialPath,
      editable: true,
      draggable: true,
    });
    polygonRef.current = polygon;
    attachPathListeners(polygon);

    const bounds = new google.maps.LatLngBounds();
    initialPath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);
  });

  useEffect(() => {
    if (clearSignal === 0) return;
    polygonRef.current?.setMap(null);
    polygonRef.current = null;
    hasDrawnInitialRef.current = false;
    onChange("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  useEffect(() => {
    if (!map || !isDrawing) return;

    const listener = map.addListener(
      "click",
      (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;

        if (!polygonRef.current) {
          const polygon = new google.maps.Polygon({
            map,
            paths: [event.latLng.toJSON()],
            editable: true,
            draggable: true,
          });
          polygonRef.current = polygon;
          attachPathListeners(polygon);
          emitChange();
          return;
        }

        polygonRef.current.getPath().push(event.latLng);
      },
    );

    return () => listener.remove();
  }, [map, isDrawing, attachPathListeners, emitChange]);

  useEffect(() => {
    return () => {
      polygonRef.current?.setMap(null);
    };
  }, []);

  return null;
}

function ZoneMapPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (coordinates: string) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const initialPath = parseWkt(value);
  const [isDrawing, setIsDrawing] = useState(initialPath.length === 0);
  const [clearSignal, setClearSignal] = useState(0);

  if (!apiKey) {
    return (
      <p className="rounded-2xl border border-dashed border-primary/30 p-4 text-center text-sm text-dark-gray">
        لم يتم إعداد مفتاح خرائط جوجل (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      </p>
    );
  }

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-primary/15">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={initialPath[0] ?? DEFAULT_CENTER}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <PolygonDrawer
            initialPath={initialPath}
            onChange={onChange}
            isDrawing={isDrawing}
            clearSignal={clearSignal}
          />
        </Map>
      </APIProvider>

      <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center gap-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 px-2 py-1.5 shadow-md">
          <button
            type="button"
            onClick={() => setIsDrawing((current) => !current)}
            className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-secondary transition hover:bg-primary/90"
          >
            {isDrawing ? "إنهاء الرسم" : "متابعة الرسم"}
          </button>
          <button
            type="button"
            onClick={() => {
              setClearSignal((current) => current + 1);
              setIsDrawing(true);
            }}
            className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
          >
            مسح
          </button>
        </div>
      </div>

      {isDrawing && (
        <p className="pointer-events-none absolute inset-x-0 bottom-2 z-10 mx-auto w-fit rounded-full bg-white/95 px-3 py-1 text-xs text-dark-gray shadow-md">
          انقر على الخريطة لإضافة نقاط حدود المنطقة
        </p>
      )}
    </div>
  );
}

export default ZoneMapPicker;

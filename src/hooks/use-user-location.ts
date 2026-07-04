"use client";

import { useEffect, useState } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setLocation(null),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return location;
}

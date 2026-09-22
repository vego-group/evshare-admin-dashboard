"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

import { NETWORK_OFFLINE_EVENT } from "@/lib/toast-events";

export default function NetworkStatusListener() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener(NETWORK_OFFLINE_EVENT, handleOffline);

    if (!navigator.onLine) handleOffline();

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener(NETWORK_OFFLINE_EVENT, handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center bg-background px-6 text-center"
    >
      <div className="flex -translate-y-8 flex-col items-center">
        <div className="mb-9 flex size-28 items-center justify-center rounded-full border border-primary bg-primary text-secondary shadow-lg">
          <WifiOff className="size-12" strokeWidth={2.2} aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-secondary sm:text-4xl">
          أنت غير متصل بالإنترنت
        </h1>
        <p className="mt-6 text-lg text-text-muted sm:text-xl">
          تحقق من اتصالك بالشبكة أو الإنترنت.
        </p>
      </div>
    </div>
  );
}

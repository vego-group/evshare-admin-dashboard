"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Header from "@/components/ui/header";
import { useActiveTrips } from "@/hooks/api";
import { cancelTripAPI, endTripAPI } from "@/services/mutations";
import type { TripListItem } from "@/types";

import { CancelTripConfirmModal, EndTripConfirmModal } from "./modals";
import TripMap from "./trip-map";
import TripSidebar from "./trip-sidebar";

function ActiveTrips() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useActiveTrips();
  const trips = data?.data ?? [];
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [pendingTrip, setPendingTrip] = useState<TripListItem | null>(null);
  const [pendingAction, setPendingAction] = useState<"cancel" | "end" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function requestAction(action: "cancel" | "end") {
    return (trip: TripListItem) => {
      setPendingTrip(trip);
      setPendingAction(action);
    };
  }

  async function handleConfirm() {
    if (!pendingTrip || !pendingAction || isSubmitting) return;
    setIsSubmitting(true);
    const result =
      pendingAction === "cancel"
        ? await cancelTripAPI(pendingTrip.id)
        : await endTripAPI(pendingTrip.id);
    setIsSubmitting(false);

    if (result?.ok) {
      toast.success(result.message || "تم تنفيذ الإجراء بنجاح");
      setPendingTrip(null);
      setPendingAction(null);
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
      return;
    }
    toast.error(result?.message || "فشل تنفيذ الإجراء");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="الرحلات النشطة" subtitle="متابعة مباشرة للرحلات الجارية على الخريطة" />

      {isLoading ? (
        <p className="p-6 text-center text-sm text-gray">جارٍ التحميل...</p>
      ) : (
        <div className="flex h-[70vh] min-h-[420px] flex-col gap-4 lg:h-[75vh] lg:flex-row">
          <div className="order-2 min-h-64 flex-1 lg:order-1 lg:min-h-0">
            <TripMap
              trips={trips}
              selectedTripId={selectedTripId}
              onSelectTrip={setSelectedTripId}
              onCancelTrip={requestAction("cancel")}
              onEndTrip={requestAction("end")}
            />
          </div>
          <div className="order-1 h-56 shrink-0 lg:order-2 lg:h-auto lg:w-80">
            <TripSidebar
              trips={trips}
              selectedTripId={selectedTripId}
              onSelectTrip={setSelectedTripId}
              onCancelTrip={requestAction("cancel")}
              onEndTrip={requestAction("end")}
            />
          </div>
        </div>
      )}

      <CancelTripConfirmModal
        open={pendingAction === "cancel"}
        isSubmitting={isSubmitting}
        onClose={() => { setPendingAction(null); setPendingTrip(null); }}
        onConfirm={handleConfirm}
      />
      <EndTripConfirmModal
        open={pendingAction === "end"}
        isSubmitting={isSubmitting}
        onClose={() => { setPendingAction(null); setPendingTrip(null); }}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default ActiveTrips;

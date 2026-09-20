"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

import Header from "@/components/ui/header";
import QueryErrorState from "@/components/ui/query-error-state";
import { useActiveTrips } from "@/hooks/api";
import { cancelTripAPI, endTripAPI } from "@/services/mutations";
import type { TripListItem } from "@/types";
import { ADMIN_PERMISSIONS } from "@/constants";
import { useUserPermissions } from "@/hooks";

import { CancelTripConfirmModal, EndTripConfirmModal } from "./modals";
import TripSidebar from "./trip-sidebar";

const TripMap = dynamic(() => import("./trip-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-primary/5" />,
});

function ActiveTrips() {
  const { hasPermission } = useUserPermissions();
  const queryClient = useQueryClient();
  const {
    data,
    dataUpdatedAt,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useActiveTrips();
  const trips = data ?? [];
  const hasLoadedData = data !== undefined;
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [pendingTrip, setPendingTrip] = useState<TripListItem | null>(null);
  const [pendingAction, setPendingAction] = useState<"cancel" | "end" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [endError, setEndError] = useState<string | null>(null);

  function requestAction(action: "cancel" | "end") {
    return (trip: TripListItem) => {
      const requiredPermission = ADMIN_PERMISSIONS.trips[action];
      if (!hasPermission(requiredPermission)) return;
      setPendingTrip(trip);
      setPendingAction(action);
      setEndError(null);
    };
  }

  async function handleConfirm() {
    if (!pendingTrip || !pendingAction || isSubmitting) return;
    if (!hasPermission(ADMIN_PERMISSIONS.trips[pendingAction])) {
      setPendingTrip(null);
      setPendingAction(null);
      return;
    }
    setIsSubmitting(true);
    const result =
      pendingAction === "cancel"
        ? await cancelTripAPI(pendingTrip.id)
        : await endTripAPI(pendingTrip.id);
    setIsSubmitting(false);

    if (result?.ok) {
      setEndError(null);
      toast.success(result.message || "تم تنفيذ الإجراء بنجاح");
      setPendingTrip(null);
      setPendingAction(null);
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
      return;
    }
    if (pendingAction === "end" && (result?.status === 409 || result?.status === 503)) {
      const errors = result.error?.errors;
      const reason = errors && typeof errors === "object" && "reason" in errors && typeof errors.reason === "string"
        ? errors.reason
        : null;
      setEndError([result.message, reason].filter(Boolean).join(" — "));
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
      return;
    }
    toast.error(result?.message || "فشل تنفيذ الإجراء");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Header
        title="الرحلات النشطة"
        subtitle="متابعة مباشرة للرحلات الجارية على الخريطة"
      />

      {hasLoadedData ? (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/15 bg-white px-4 py-2 text-xs text-gray"
        >
          <span>{trips.length} رحلة نشطة</span>
          <span>
            {isFetching
              ? "جارٍ التحديث..."
              : `آخر تحديث: ${formatUpdateTime(dataUpdatedAt)}`}
          </span>
        </div>
      ) : null}

      {isError && hasLoadedData ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>تعذر تحديث الرحلات النشطة. يتم عرض آخر بيانات متاحة.</span>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="font-semibold underline underline-offset-2 disabled:opacity-50"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="p-6 text-center text-sm text-gray">جارٍ التحميل...</p>
      ) : isError && !hasLoadedData ? (
        <QueryErrorState
          title="تعذر تحميل الرحلات النشطة"
          isRetrying={isFetching}
          onRetry={() => void refetch()}
        />
      ) : (
        <div className="flex h-[70vh] min-h-105 flex-col gap-4 lg:h-[75vh] lg:flex-row">
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
        onClose={() => {
          setPendingAction(null);
          setPendingTrip(null);
        }}
        onConfirm={handleConfirm}
      />
      <EndTripConfirmModal
        open={pendingAction === "end"}
        isSubmitting={isSubmitting}
        error={endError}
        onClose={() => {
          setPendingAction(null);
          setPendingTrip(null);
          setEndError(null);
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

function formatUpdateTime(timestamp: number) {
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export default ActiveTrips;

"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

import Header from "@/components/ui/header";
import QueryErrorState from "@/components/ui/query-error-state";
import { useActiveTrips } from "@/hooks/api";
import { cancelTripAPI, endTripAPI } from "@/services/mutations";
import type { TripListItem, TripMutationError } from "@/types";
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
  const [actionError, setActionError] = useState<string | null>(null);
  const actionAttemptRef = useRef<{
    action: "cancel" | "end";
    tripId: string;
    idempotencyKey: string;
  } | null>(null);
  const isActionSubmittingRef = useRef(false);

  function requestAction(action: "cancel" | "end") {
    return (trip: TripListItem) => {
      const requiredPermission = ADMIN_PERMISSIONS.trips[action];
      if (!hasPermission(requiredPermission)) return;
      if (trip.status !== "started" && trip.status !== "in_progress") {
        toast.error("لم تعد الرحلة نشطة. حدّث القائمة وحاول مرة أخرى.");
        void queryClient.invalidateQueries({ queryKey: ["trips"] });
        return;
      }
      actionAttemptRef.current = null;
      setPendingTrip(trip);
      setPendingAction(action);
      setActionError(null);
    };
  }

  async function handleConfirm() {
    if (!pendingTrip || !pendingAction || isActionSubmittingRef.current) return;
    if (!hasPermission(ADMIN_PERMISSIONS.trips[pendingAction])) {
      setPendingTrip(null);
      setPendingAction(null);
      return;
    }
    isActionSubmittingRef.current = true;
    setIsSubmitting(true);
    setActionError(null);
    const idempotencyKey = getTripActionIdempotencyKey(
      actionAttemptRef,
      pendingAction,
      pendingTrip.id,
    );

    try {
      const result =
        pendingAction === "cancel"
          ? await cancelTripAPI(pendingTrip.id, idempotencyKey)
          : await endTripAPI(pendingTrip.id, idempotencyKey);

      if (result?.ok && result.data?.state === "COMPLETED" && result.data.succeeded) {
        actionAttemptRef.current = null;
        setActionError(null);
        toast.success(
          pendingAction === "end"
            ? "اكتمل إنهاء الرحلة وتسويتها بنجاح"
            : "اكتمل إلغاء الرحلة بنجاح",
        );
        setPendingTrip(null);
        setPendingAction(null);
        await queryClient.invalidateQueries({ queryKey: ["trips"] });
        return;
      }

      if (result?.ok && result.data) {
        actionAttemptRef.current = null;
        const reference = result.data.correlation_id
          ? ` — رقم التتبع: ${result.data.correlation_id}`
          : "";
        toast(
          tripOperationStatusMessage(result.data.state) + reference,
          { icon: result.data.needs_attention ? "⚠️" : "⏳" },
        );
        setPendingTrip(null);
        setPendingAction(null);
        await queryClient.invalidateQueries({ queryKey: ["trips"] });
        return;
      }

      setActionError(formatTripActionError(result?.message, result?.error));
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
    } catch {
      setActionError(
        "تعذر تأكيد نتيجة الإجراء. تم تحديث الرحلات، ويمكنك إعادة المحاولة بأمان.",
      );
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
    } finally {
      isActionSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function closeActionModal() {
    if (isSubmitting) return;
    actionAttemptRef.current = null;
    setPendingAction(null);
    setPendingTrip(null);
    setActionError(null);
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
        error={actionError}
        onClose={closeActionModal}
        onConfirm={handleConfirm}
      />
      <EndTripConfirmModal
        open={pendingAction === "end"}
        isSubmitting={isSubmitting}
        error={actionError}
        onClose={closeActionModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

function getTripActionIdempotencyKey(
  attempt: React.MutableRefObject<{
    action: "cancel" | "end";
    tripId: string;
    idempotencyKey: string;
  } | null>,
  action: "cancel" | "end",
  tripId: string,
) {
  if (attempt.current?.action === action && attempt.current.tripId === tripId) {
    return attempt.current.idempotencyKey;
  }

  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const idempotencyKey = `admin-trip-${tripId}-${action}-${suffix}`;
  attempt.current = { action, tripId, idempotencyKey };
  return idempotencyKey;
}

function formatTripActionError(
  fallbackMessage?: string,
  error?: TripMutationError,
) {
  const reason = Array.isArray(error?.errors?.reason)
    ? error.errors.reason.join(" ")
    : error?.errors?.reason;
  const reference = error?.correlation_id
    ? `رقم التتبع: ${error.correlation_id}`
    : null;

  return [
    error?.message || fallbackMessage || "تعذر تنفيذ الإجراء. يمكنك المحاولة مرة أخرى بأمان.",
    reason,
    reference,
  ]
    .filter(Boolean)
    .join(" — ");
}

function tripOperationStatusMessage(state: string) {
  if (state === "DEVICE_PENDING") {
    return "لم يؤكد الجهاز الإجراء بعد، ولم تتم أي تسوية مالية.";
  }
  if (state === "RECONCILIATION_REQUIRED") {
    return "تحتاج العملية إلى مراجعة وتسوية بشرية قبل اعتبارها مكتملة.";
  }
  if (state === "COMPENSATED") {
    return "تعذر الإجراء وتم التراجع عن الخطوات المنفذة بأمان.";
  }
  if (state === "FAILED") return "فشلت العملية ولم تُعتبر الرحلة مكتملة.";
  return "تم قبول العملية وما زالت قيد التنفيذ؛ لم تُعتبر مكتملة بعد.";
}

function formatUpdateTime(timestamp: number) {
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export default ActiveTrips;

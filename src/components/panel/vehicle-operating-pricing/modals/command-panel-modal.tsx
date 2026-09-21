"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Link2,
  Lock,
  MapPin,
  Plus,
  Unlink,
  Unlock,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { useHasPermission } from "@/hooks";
import {
  useVehicleAssignedLock,
  useVehicleDeviceCommand,
  useVehicleLocks,
} from "@/hooks/api";
import { cn } from "@/lib/utils";
import { isGatewayDeviceId } from "@/lib/utils/device-id";
import type { VehicleCommandValues } from "@/schemas/vehicle-operating-pricing";
import {
  addVehicleLockAPI,
  assignVehicleLockAPI,
  sendVehicleCommandAPI,
  unassignVehicleLockAPI,
} from "@/services/mutations";
import type {
  VehicleDeviceCommand,
  VehicleDeviceCommandStatus,
  VehicleListItem,
  VehicleLock,
} from "@/types";
import { formatDate, vehicleTitle } from "../utils";
import { ADMIN_PERMISSIONS } from "@/constants";

type PendingAction =
  | "lock"
  | "unlock"
  | "locate"
  | "sound_alarm"
  | "assign_existing"
  | "create_lock"
  | "unassign_lock";

const UNKNOWN_COMMAND_OUTCOME_STATUSES = new Set([408, 500, 502, 503, 504]);

const lockActions: {
  action: Extract<PendingAction, "lock" | "unlock">;
  label: string;
  permission: string | string[];
  icon: LucideIcon;
  className: string;
}[] = [
  {
    action: "lock",
    label: "قفل",
    permission: ["Admin Send Vehicle Commands", "Admin Command Vehicles", "Admin Lock Vehicles"],
    icon: Lock,
    className: "bg-red-50 text-red-600",
  },
  {
    action: "unlock",
    label: "فتح",
    permission: ["Admin Send Vehicle Commands", "Admin Command Vehicles", "Admin Unlock Vehicles"],
    icon: Unlock,
    className: "bg-green-50 text-green-600",
  },
];

function CommandPanelModal({
  vehicle,
  open,
  onClose,
}: {
  vehicle: VehicleListItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [selectedLockId, setSelectedLockId] = useState("");
  const [newLockDeviceId, setNewLockDeviceId] = useState("");
  const [deviceIdError, setDeviceIdError] = useState(false);
  const [newLockNotes, setNewLockNotes] = useState("");
  const [submittedCommand, setSubmittedCommand] = useState<{
    vehicleId: string;
    command: VehicleDeviceCommand;
  } | null>(null);
  const announcedTerminalState = useRef<string | null>(null);
  const commandAttempt = useRef<{
    action: VehicleDeviceCommand["type"];
    lockId: string;
    idempotencyKey: string;
  } | null>(null);
  const canViewLocks = useHasPermission("Admin View Locks");
  const canAssignLocks = useHasPermission(ADMIN_PERMISSIONS.locks.assign);
  const vehicleId = open ? (vehicle?.id ?? null) : null;
  const { data: assignedLockData, isLoading: isLoadingLock } =
    useVehicleAssignedLock(canViewLocks ? vehicleId : null);
  const assignedLock = useMemo(
    () => assignedLockData?.data ?? vehicle?.lock ?? null,
    [assignedLockData?.data, vehicle?.lock],
  );
  const { data: unassignedLocksData, isLoading: isLoadingUnassignedLocks } =
    useVehicleLocks(
      { assigned: false, limit: 100 },
      { enabled: Boolean(vehicleId && canViewLocks && canAssignLocks) },
    );
  const unassignedLocks = unassignedLocksData?.data ?? [];
  const activeCommand =
    submittedCommand?.vehicleId === vehicleId
      ? submittedCommand.command
      : readStoredCommand(vehicleId);
  const {
    data: commandStatusData,
    isError: isCommandStatusError,
    refetch: refetchCommandStatus,
  } = useVehicleDeviceCommand(
    vehicleId,
    activeCommand?.command_id ?? null,
    Boolean(activeCommand),
  );
  const queriedCommand = commandStatusData;
  const displayedCommand =
    queriedCommand?.command_id === activeCommand?.command_id
      ? queriedCommand
      : activeCommand;
  const commandInProgress = isPendingCommand(displayedCommand?.status);
  const isBusy = Boolean(pendingAction) || commandInProgress;

  useEffect(() => {
    const command = commandStatusData;
    if (
      !vehicleId ||
      !command ||
      command.command_id !== activeCommand?.command_id
    ) {
      return;
    }

    if (isPendingCommand(command.status)) {
      window.localStorage.setItem(
        commandStorageKey(vehicleId),
        JSON.stringify(command),
      );
      return;
    }

    if (vehicleId) {
      window.localStorage.removeItem(commandStorageKey(vehicleId));
    }
    const terminalKey = `${command.command_id}:${command.status}`;
    if (announcedTerminalState.current === terminalKey) return;
    announcedTerminalState.current = terminalKey;

    if (command.status === "acknowledged" && command.physical_action_confirmed) {
      toast.success(commandSuccessMessage(command.type));
    } else {
      toast.error(commandFailureMessage(command));
    }
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: ["vehicle-lock", vehicleId] }),
      queryClient.invalidateQueries({ queryKey: ["locks"] }),
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] }),
      queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
    ]);
  }, [activeCommand?.command_id, commandStatusData, queryClient, vehicleId]);

  if (!vehicle) return null;

  const currentVehicle = vehicle;
  const hasVehicleDevice = Boolean(currentVehicle.iot_device_id);

  async function refreshLockState() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["vehicle-lock", currentVehicle.id],
      }),
      queryClient.invalidateQueries({ queryKey: ["lock", assignedLock?.id] }),
      queryClient.invalidateQueries({ queryKey: ["locks"] }),
      queryClient.invalidateQueries({
        queryKey: ["vehicle", currentVehicle.id],
      }),
      queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
    ]);
  }

  async function assignExistingLock() {
    if (isBusy || !selectedLockId) return;
    const selectedLock = unassignedLocks.find((lock) => lock.id === selectedLockId);
    if (!selectedLock || !isGatewayDeviceId(selectedLock.device_id)) {
      toast.error("معرف القفل ليس UUID صالحًا. صحح معرف الجهاز قبل ربطه.");
      return;
    }
    setPendingAction("assign_existing");
    const result = await assignVehicleLockAPI(selectedLockId, {
      vehicle_uuid: currentVehicle.id,
    });
    setPendingAction(null);

    if (result?.ok) {
      toast.success(result.message || "تم ربط القفل بالمركبة بنجاح");
      setSelectedLockId("");
      await refreshLockState();
      return;
    }

    toast.error(result?.message || "فشل ربط القفل بالمركبة");
  }

  async function createAndAssignLock() {
    const deviceId = newLockDeviceId.trim();
    if (isBusy || !deviceId) return;
    if (!isGatewayDeviceId(deviceId)) {
      setDeviceIdError(true);
      return;
    }
    setDeviceIdError(false);
    setPendingAction("create_lock");
    const result = await addVehicleLockAPI({
      device_id: deviceId,
      vehicle_uuid: currentVehicle.id,
      ...(newLockNotes.trim() ? { notes: newLockNotes.trim() } : {}),
    });
    setPendingAction(null);

    if (result?.ok) {
      toast.success(result.message || "تم إنشاء القفل وربطه بالمركبة بنجاح");
      setNewLockDeviceId("");
      setDeviceIdError(false);
      setNewLockNotes("");
      await refreshLockState();
      return;
    }

    toast.error(result?.message || "فشل إنشاء القفل وربطه بالمركبة");
  }

  async function unassignCurrentLock() {
    if (isBusy || !assignedLock) return;
    setPendingAction("unassign_lock");
    const result = await unassignVehicleLockAPI(assignedLock.id);
    setPendingAction(null);

    if (result?.ok) {
      toast.success(result.message || "تم فك ربط القفل من المركبة");
      await refreshLockState();
      return;
    }

    toast.error(result?.message || "فشل فك ربط القفل من المركبة");
  }

  async function dispatchLock(action: "lock" | "unlock") {
    if (pendingAction || commandInProgress || !assignedLock) return;
    setPendingAction(action);
    const idempotencyKey = getCommandIdempotencyKey(
      commandAttempt,
      action,
      assignedLock.id,
    );
    const result = await sendVehicleCommandAPI(currentVehicle.id, {
      type: action,
      idempotencyKey,
    });
    setPendingAction(null);

    if (result?.ok) {
      commandAttempt.current = null;
      handleAcceptedCommand(result.data);
      return;
    }

    if (!UNKNOWN_COMMAND_OUTCOME_STATUSES.has(result?.status ?? 500)) {
      commandAttempt.current = null;
    }

    toast.error(
      result?.message ||
        (action === "lock" ? "فشل قفل المركبة" : "فشل فتح المركبة"),
    );
  }

  async function dispatchLocate() {
    if (pendingAction || commandInProgress || !assignedLock) return;
    setPendingAction("locate");
    const idempotencyKey = getCommandIdempotencyKey(
      commandAttempt,
      "locate",
      assignedLock.id,
    );
    const result = await sendVehicleCommandAPI(currentVehicle.id, {
      type: "locate",
      idempotencyKey,
    });
    setPendingAction(null);

    if (result?.ok) {
      commandAttempt.current = null;
      handleAcceptedCommand(result.data);
      return;
    }

    if (!UNKNOWN_COMMAND_OUTCOME_STATUSES.has(result?.status ?? 500)) {
      commandAttempt.current = null;
    }

    toast.error(result?.message || "فشل تحديد موقع المركبة");
  }

  function handleAcceptedCommand(command?: VehicleDeviceCommand) {
    if (!command?.command_id) {
      toast("تم إرسال الطلب، لكن الخادم لم يُرجع معرفًا لتتبع النتيجة.", {
        icon: "⚠️",
      });
      return;
    }

    setSubmittedCommand({ vehicleId: currentVehicle.id, command });
    if (isPendingCommand(command.status)) {
      window.localStorage.setItem(
        commandStorageKey(currentVehicle.id),
        JSON.stringify(command),
      );
      toast.success("تم قبول الأمر وجارٍ انتظار تأكيد الجهاز");
      return;
    }

    if (command.status === "acknowledged" && command.physical_action_confirmed) {
      toast.success(commandSuccessMessage(command.type));
      void refreshLockState();
    } else {
      toast.error(commandFailureMessage(command));
    }
  }

  async function dispatchVehicleCommand(type: VehicleCommandValues["type"]) {
    if (isBusy) return;
    const pending = type === "ring" ? "sound_alarm" : type;
    setPendingAction(pending);
    const idempotencyKey = getCommandIdempotencyKey(
      commandAttempt,
      type,
      assignedLock?.id ?? currentVehicle.iot_device_id ?? currentVehicle.id,
    );
    const result = await sendVehicleCommandAPI(currentVehicle.id, {
      type,
      idempotencyKey,
    });
    setPendingAction(null);

    if (result?.ok) {
      commandAttempt.current = null;
      handleAcceptedCommand(result.data);
      return;
    }

    if (!UNKNOWN_COMMAND_OUTCOME_STATUSES.has(result?.status ?? 500)) {
      commandAttempt.current = null;
    }
    toast.error(result?.message || "فشل إرسال الأمر");
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`لوحة التحكم - ${vehicleTitle(vehicle)}`}
      contentClassName="md:max-w-2xl"
    >
      <div className="space-y-4 p-1">
        <section className="space-y-3 rounded-[14px] bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-secondary">
              القفل الفعلي
            </h4>
            <LockStatus lock={assignedLock} isLoading={isLoadingLock} />
          </div>

          {!canViewLocks ? (
            <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
              تحتاج صلاحية Admin View Locks لعرض بيانات القفل وربطه بالمركبة.
            </p>
          ) : isLoadingLock ? (
            <p className="rounded-xl bg-white p-3 text-center text-sm text-gray">
              جاري تحميل بيانات القفل...
            </p>
          ) : assignedLock ? (
            <>
              <div className="grid gap-2 text-sm">
                <InfoRow
                  label="معرف جهاز القفل"
                  value={assignedLock.device_id}
                />
                {!isGatewayDeviceId(assignedLock.device_id) && (
                  <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-orange-700">معرف القفل ليس UUID صالحًا. استخدم معرف الجهاز من وحدة Vego IoT.</p>
                )}
                <InfoRow label="آخر اتصال" value={formatDate(assignedLock.last_seen_at ?? undefined)} />
                <InfoRow
                  label="آخر قفل"
                  value={formatDate(assignedLock.last_lock_date ?? undefined)}
                />
                <InfoRow
                  label="آخر فتح"
                  value={formatDate(assignedLock.last_unlock_date ?? undefined)}
                />
                <InfoRow
                  label="آخر موقع GPS"
                  value={
                    assignedLock.location
                      ? `${assignedLock.location.latitude}, ${assignedLock.location.longitude}${
                          assignedLock.location_is_stale ? " (غير محدث)" : ""
                        }`
                      : "لم يتم تحديد الموقع بعد"
                  }
                />
                <InfoRow
                  label="تاريخ آخر تحديث للموقع"
                  value={formatDate(assignedLock.last_location_date ?? undefined)}
                />
              </div>

              {displayedCommand && (
                <CommandStatusCard
                  command={displayedCommand}
                  refreshFailed={isCommandStatusError}
                  onRetry={() => void refetchCommandStatus()}
                />
              )}

              <PermissionGate slug={["Admin Send Vehicle Commands", "Admin Command Vehicles", "Admin Locate Vehicles"]}>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={dispatchLocate}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600 transition hover:brightness-95 disabled:opacity-60"
                >
                  {pendingAction === "locate" ||
                  (commandInProgress && displayedCommand?.type === "locate") ? (
                    <Loader />
                  ) : (
                    <MapPin className="size-5 shrink-0" />
                  )}
                  تحديد موقع المركبة
                </button>
              </PermissionGate>

              <div className="grid gap-3 sm:grid-cols-2">
                {lockActions.map(
                  ({ action, label, permission, icon: Icon, className }) => {
                    const isCurrentState =
                      (action === "lock" && assignedLock.status === "locked") ||
                      (action === "unlock" &&
                        assignedLock.status === "unlocked");

                    return (
                      <PermissionGate key={action} slug={permission}>
                        <button
                          type="button"
                          disabled={isBusy || isCurrentState}
                          onClick={() => dispatchLock(action)}
                          className={cn(
                            "flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60",
                            className,
                          )}
                        >
                          {pendingAction === action ||
                          (commandInProgress && displayedCommand?.type === action) ? (
                            <Loader />
                          ) : (
                            <Icon className="size-6 shrink-0" />
                          )}
                          {label}
                        </button>
                      </PermissionGate>
                    );
                  },
                )}
              </div>

              <PermissionGate slug={ADMIN_PERMISSIONS.locks.unassign}>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={unassignCurrentLock}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {pendingAction === "unassign_lock" ? (
                    <Loader />
                  ) : (
                    <Unlink className="size-5 shrink-0" />
                  )}
                  فك ربط القفل
                </button>
              </PermissionGate>
            </>
          ) : (
            <div className="space-y-4">
              <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
                لا يوجد قفل مخصص لهذه المركبة. اربط قفل قبل تنفيذ أوامر القفل
                والفتح.
              </p>

              <PermissionGate
                slug={ADMIN_PERMISSIONS.locks.assign}
                fallback={
                  <p className="rounded-xl bg-white p-3 text-center text-sm text-gray">
                    تحتاج صلاحية Admin Assign Locks لربط قفل موجود.
                  </p>
                }
              >
                <div className="space-y-3 rounded-xl bg-white p-3">
                  <label className="block">
                    <span className="mb-2 block text-sm text-dark-gray">
                      اختيار قفل غير مربوط
                    </span>
                    <select
                      value={selectedLockId}
                      onChange={(event) =>
                        setSelectedLockId(event.target.value)
                      }
                      disabled={
                        isLoadingUnassignedLocks || isBusy
                      }
                      className="h-11 w-full rounded-xl border border-primary/15 bg-background px-3 text-right text-sm outline-none transition focus:border-primary"
                    >
                      <option value="">
                        {isLoadingUnassignedLocks
                          ? "جاري تحميل الأقفال..."
                          : "اختر القفل"}
                      </option>
                      {unassignedLocks.map((lock) => (
                        <option key={lock.id} value={lock.id} disabled={!isGatewayDeviceId(lock.device_id)}>
                          {lock.device_id}{isGatewayDeviceId(lock.device_id) ? "" : " — معرف غير صالح"}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    disabled={
                      isBusy ||
                      isLoadingUnassignedLocks ||
                      !selectedLockId
                    }
                    onClick={assignExistingLock}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-60"
                  >
                    {pendingAction === "assign_existing" ? (
                      <Loader />
                    ) : (
                      <Link2 className="size-5 shrink-0" />
                    )}
                    ربط القفل المحدد
                  </button>
                </div>
              </PermissionGate>

              <PermissionGate
                slug="Admin Add Locks"
                fallback={
                  <p className="rounded-xl bg-white p-3 text-center text-sm text-gray">
                    تحتاج صلاحية Admin Add Locks لإنشاء قفل جديد.
                  </p>
                }
              >
                <div className="space-y-3 rounded-xl bg-white p-3">
                  <label className="block">
                    <span className="mb-2 block text-sm text-dark-gray">
                      إنشاء قفل جديد بمعرف Vego
                    </span>
                    <input
                      value={newLockDeviceId}
                      onChange={(event) => {
                        setNewLockDeviceId(event.target.value);
                        setDeviceIdError(false);
                      }}
                      disabled={isBusy}
                      placeholder="3fcbff96-04c0-4803-a24f-6f6aba32f8e7"
                      dir="ltr"
                      className="h-11 w-full rounded-xl border border-primary/15 bg-background px-3 text-left text-sm outline-none transition focus:border-primary"
                    />
                    <span className="mt-1 block text-xs text-gray">استخدم UUID الجهاز من وحدة Vego IoT.</span>
                    {deviceIdError && <span role="alert" className="mt-1 block text-xs text-red-600">يجب إدخال UUID صالح للجهاز.</span>}
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-dark-gray">
                      ملاحظات
                    </span>
                    <textarea
                      value={newLockNotes}
                      onChange={(event) => setNewLockNotes(event.target.value)}
                      disabled={isBusy}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-primary/15 bg-background px-3 py-2 text-right text-sm outline-none transition focus:border-primary"
                    />
                  </label>

                  <button
                    type="button"
                    disabled={isBusy || !newLockDeviceId.trim()}
                    onClick={createAndAssignLock}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-60"
                  >
                    {pendingAction === "create_lock" ? (
                      <Loader />
                    ) : (
                      <Plus className="size-5 shrink-0" />
                    )}
                    إنشاء وربط القفل
                  </button>
                </div>
              </PermissionGate>
            </div>
          )}
        </section>

        <section className="space-y-3 rounded-[14px] bg-background p-4">
          <h4 className="text-sm font-semibold text-secondary">
            جهاز IoT للمركبة
          </h4>
          <InfoRow label="معرف الجهاز" value={vehicle.iot_device_id ?? "-"} />

          {!hasVehicleDevice ? (
            <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
              لا يوجد جهاز IoT مربوط بهذه المركبة.
            </p>
          ) : (
            <PermissionGate slug={ADMIN_PERMISSIONS.vehicles.sendCommand}>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => dispatchVehicleCommand("ring")}
                className="flex min-h-20 w-full items-center justify-center gap-2 rounded-xl bg-amber-50 p-4 text-sm font-medium text-orange-500 transition hover:brightness-95 disabled:opacity-60"
              >
                {pendingAction === "sound_alarm" ? (
                  <Loader />
                ) : (
                  <Volume2 className="size-6 shrink-0" />
                )}
                تشغيل الجرس
              </button>
            </PermissionGate>
          )}
        </section>
      </div>
    </Modal>
  );
}

function LockStatus({
  lock,
  isLoading,
}: {
  lock: VehicleLock | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray">
        جار التحميل
      </span>
    );
  }

  if (!lock) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
        غير مربوط
      </span>
    );
  }

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        lock.status === "locked"
          ? "bg-red-50 text-red-600"
          : "bg-green-50 text-green-600",
      )}
    >
      {lock.status === "locked" ? "مقفل" : "مفتوح"}
    </span>
  );
}

function CommandStatusCard({
  command,
  refreshFailed,
  onRetry,
}: {
  command: VehicleDeviceCommand;
  refreshFailed: boolean;
  onRetry: () => void;
}) {
  const pending = isPendingCommand(command.status);
  const statusStyles: Record<VehicleDeviceCommandStatus, string> = {
    accepted: "bg-blue-50 text-blue-700",
    sent: "bg-blue-50 text-blue-700",
    acknowledged: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700",
    timed_out: "bg-amber-50 text-amber-700",
    superseded: "bg-slate-100 text-slate-600",
  };

  return (
    <div
      className="space-y-2 rounded-xl border border-primary/10 bg-white p-3"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-secondary">
          حالة آخر أمر: {commandTypeLabel(command.type)}
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            statusStyles[command.status],
          )}
        >
          {commandStatusLabel(command.status)}
        </span>
      </div>
      {pending && (
        <p className="text-xs text-gray">
          قبول الخادم للأمر لا يعني أن الجهاز نفّذه بعد. سيتم تحديث الحالة
          تلقائيًا عند وصول التأكيد.
        </p>
      )}
      <div className="space-y-1 text-xs text-gray" dir="ltr">
        <p className="break-all">Command: {command.command_id}</p>
        <p className="break-all">Correlation: {command.correlation_id}</p>
      </div>
      {refreshFailed && pending && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
          <span>تعذر تحديث حالة الأمر مؤقتًا.</span>
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 font-semibold underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      {!pending && command.failure_message && (
        <p className="text-xs text-red-600">{command.failure_message}</p>
      )}
    </div>
  );
}

function isPendingCommand(status?: VehicleDeviceCommandStatus) {
  return status === "accepted" || status === "sent";
}

function commandStorageKey(vehicleId: string) {
  return `evshare:vehicle-command:${vehicleId}`;
}

function createCommandIdempotencyKey(lockId: string, action: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `lock-${lockId}-${action}-${suffix}`;
}

function getCommandIdempotencyKey(
  attempt: React.MutableRefObject<{
    action: VehicleDeviceCommand["type"];
    lockId: string;
    idempotencyKey: string;
  } | null>,
  action: VehicleDeviceCommand["type"],
  lockId: string,
) {
  if (
    attempt.current?.action === action &&
    attempt.current.lockId === lockId
  ) {
    return attempt.current.idempotencyKey;
  }

  const idempotencyKey = createCommandIdempotencyKey(lockId, action);
  attempt.current = { action, lockId, idempotencyKey };
  return idempotencyKey;
}

function readStoredCommand(vehicleId: string | null) {
  if (!vehicleId || typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(commandStorageKey(vehicleId));
    if (!stored) return null;
    const command = JSON.parse(stored) as VehicleDeviceCommand;
    if (command.command_id && isPendingCommand(command.status)) return command;
    window.localStorage.removeItem(commandStorageKey(vehicleId));
  } catch {
    window.localStorage.removeItem(commandStorageKey(vehicleId));
  }
  return null;
}

function commandTypeLabel(type: VehicleDeviceCommand["type"]) {
  if (type === "lock") return "قفل";
  if (type === "unlock") return "فتح";
  if (type === "locate") return "تحديد الموقع";
  return "تشغيل الجرس";
}

function commandStatusLabel(status: VehicleDeviceCommandStatus) {
  const labels: Record<VehicleDeviceCommandStatus, string> = {
    accepted: "مقبول",
    sent: "تم الإرسال للجهاز",
    acknowledged: "تم التأكيد",
    failed: "فشل",
    timed_out: "انتهت المهلة",
    superseded: "تم استبداله",
  };
  return labels[status];
}

function commandSuccessMessage(type: VehicleDeviceCommand["type"]) {
  if (type === "lock") return "أكد الجهاز قفل المركبة بنجاح";
  if (type === "unlock") return "أكد الجهاز فتح المركبة بنجاح";
  if (type === "locate") return "أكد الجهاز تحديث موقع المركبة بنجاح";
  return "أكد الجهاز تشغيل الجرس بنجاح";
}

function commandFailureMessage(command: VehicleDeviceCommand) {
  if (command.failure_message) return command.failure_message;
  if (command.status === "acknowledged" && !command.physical_action_confirmed) {
    return "وصل إقرار للأمر، لكن الخادم لم يؤكد تنفيذ الإجراء الفعلي.";
  }
  if (command.status === "timed_out") {
    return "انتهت مهلة الأمر دون تأكيد من الجهاز";
  }
  if (command.status === "superseded") {
    return "تم استبدال الأمر بأمر أحدث";
  }
  return `فشل تنفيذ أمر ${commandTypeLabel(command.type)}`;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[38%_1fr] items-center gap-3 rounded-xl bg-white px-3 py-2">
      <span className="text-gray">{label}</span>
      <span className="min-w-0 break-all font-medium text-secondary" dir="ltr">
        {value || "-"}
      </span>
    </div>
  );
}

export default CommandPanelModal;

"use client";

import { useMemo, useState } from "react";
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
import { useVehicleAssignedLock, useVehicleLocks } from "@/hooks/api";
import { cn } from "@/lib/utils";
import type { VehicleCommandValues } from "@/schemas/vehicle-operating-pricing";
import {
  addVehicleLockAPI,
  assignVehicleLockAPI,
  locateVehicleLockAPI,
  lockVehicleLockAPI,
  sendVehicleCommandAPI,
  unassignVehicleLockAPI,
  unlockVehicleLockAPI,
} from "@/services/mutations";
import type { VehicleListItem, VehicleLock } from "@/types";
import { formatDate, vehicleTitle } from "../utils";

type PendingAction =
  | "lock"
  | "unlock"
  | "locate"
  | "sound_alarm"
  | "assign_existing"
  | "create_lock"
  | "unassign_lock";

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
    permission: "Admin Lock Vehicles",
    icon: Lock,
    className: "bg-red-50 text-red-600",
  },
  {
    action: "unlock",
    label: "فتح",
    permission: ["Admin Unlock Vehicles", "Admin Unlock Scooters"],
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
  const [newLockNotes, setNewLockNotes] = useState("");
  const canViewLocks = useHasPermission("Admin View Locks");
  const canEditLocks = useHasPermission("Admin Edit Locks");
  const vehicleId = open ? (vehicle?.id ?? null) : null;
  const { data: assignedLockData, isLoading: isLoadingLock } =
    useVehicleAssignedLock(canViewLocks ? vehicleId : null);
  const assignedLock = useMemo(
    () => vehicle?.lock ?? assignedLockData?.data ?? null,
    [assignedLockData?.data, vehicle?.lock],
  );
  const { data: unassignedLocksData, isLoading: isLoadingUnassignedLocks } =
    useVehicleLocks(
      { assigned: false, limit: 100 },
      { enabled: Boolean(vehicleId && canViewLocks && canEditLocks) },
    );
  const unassignedLocks = unassignedLocksData?.data ?? [];

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
    if (pendingAction || !selectedLockId) return;
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
    if (pendingAction || !deviceId) return;
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
      setNewLockNotes("");
      await refreshLockState();
      return;
    }

    toast.error(result?.message || "فشل إنشاء القفل وربطه بالمركبة");
  }

  async function unassignCurrentLock() {
    if (pendingAction || !assignedLock) return;
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
    if (pendingAction || !assignedLock) return;
    setPendingAction(action);
    const result =
      action === "lock"
        ? await lockVehicleLockAPI(assignedLock.id)
        : await unlockVehicleLockAPI(assignedLock.id);
    setPendingAction(null);

    if (result?.ok) {
      toast.success(
        result.message ||
          (action === "lock" ? "تم قفل المركبة بنجاح" : "تم فتح المركبة بنجاح"),
      );
      await refreshLockState();
      return;
    }

    toast.error(
      result?.message ||
        (action === "lock" ? "فشل قفل المركبة" : "فشل فتح المركبة"),
    );
  }

  async function dispatchLocate() {
    if (pendingAction || !assignedLock) return;
    setPendingAction("locate");
    const result = await locateVehicleLockAPI(assignedLock.id);
    setPendingAction(null);

    if (result?.ok) {
      toast.success(result.message || "تم تحديد موقع المركبة بنجاح");
      await refreshLockState();
      return;
    }

    toast.error(result?.message || "فشل تحديد موقع المركبة");
  }

  async function dispatchVehicleCommand(
    command: VehicleCommandValues["command"],
  ) {
    if (pendingAction) return;
    setPendingAction(command);
    const result = await sendVehicleCommandAPI(currentVehicle.id, { command });
    setPendingAction(null);

    if (result?.ok) {
      toast.success(result.message || "تم إرسال الأمر بنجاح");
      return;
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

              <PermissionGate slug="Admin Locate Vehicles">
                <button
                  type="button"
                  disabled={Boolean(pendingAction)}
                  onClick={dispatchLocate}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600 transition hover:brightness-95 disabled:opacity-60"
                >
                  {pendingAction === "locate" ? (
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
                          disabled={Boolean(pendingAction) || isCurrentState}
                          onClick={() => dispatchLock(action)}
                          className={cn(
                            "flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60",
                            className,
                          )}
                        >
                          {pendingAction === action ? (
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

              <PermissionGate slug="Admin Edit Locks">
                <button
                  type="button"
                  disabled={Boolean(pendingAction)}
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
                slug="Admin Edit Locks"
                fallback={
                  <p className="rounded-xl bg-white p-3 text-center text-sm text-gray">
                    تحتاج صلاحية Admin Edit Locks لربط قفل موجود.
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
                        isLoadingUnassignedLocks || Boolean(pendingAction)
                      }
                      className="h-11 w-full rounded-xl border border-primary/15 bg-background px-3 text-right text-sm outline-none transition focus:border-primary"
                    >
                      <option value="">
                        {isLoadingUnassignedLocks
                          ? "جاري تحميل الأقفال..."
                          : "اختر القفل"}
                      </option>
                      {unassignedLocks.map((lock) => (
                        <option key={lock.id} value={lock.id}>
                          {lock.device_id}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    disabled={
                      Boolean(pendingAction) ||
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
                      onChange={(event) =>
                        setNewLockDeviceId(event.target.value)
                      }
                      disabled={Boolean(pendingAction)}
                      placeholder="3fcbff96-04c0-4803-a24f-6f6aba32f8e7"
                      dir="ltr"
                      className="h-11 w-full rounded-xl border border-primary/15 bg-background px-3 text-left text-sm outline-none transition focus:border-primary"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-dark-gray">
                      ملاحظات
                    </span>
                    <textarea
                      value={newLockNotes}
                      onChange={(event) => setNewLockNotes(event.target.value)}
                      disabled={Boolean(pendingAction)}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-primary/15 bg-background px-3 py-2 text-right text-sm outline-none transition focus:border-primary"
                    />
                  </label>

                  <button
                    type="button"
                    disabled={Boolean(pendingAction) || !newLockDeviceId.trim()}
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
            <button
              type="button"
              disabled={Boolean(pendingAction)}
              onClick={() => dispatchVehicleCommand("sound_alarm")}
              className="flex min-h-20 w-full items-center justify-center gap-2 rounded-xl bg-amber-50 p-4 text-sm font-medium text-orange-500 transition hover:brightness-95 disabled:opacity-60"
            >
              {pendingAction === "sound_alarm" ? (
                <Loader />
              ) : (
                <Volume2 className="size-6 shrink-0" />
              )}
              تشغيل الجرس
            </button>
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

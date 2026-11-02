"use client";

import { showSuccessModal } from "@/components/ui/success-modal";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Link2,
  Lock,
  MapPin,
  Pencil,
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
import { isGatewayDeviceId } from "@/lib/utils/device-id";
import {
  vehicleCommandErrorMessage,
  type VehicleControlCommand,
} from "@/lib/utils/vehicle-command-error";
import {
  addVehicleLockAPI,
  assignVehicleLockAPI,
  editVehicleLockAPI,
  locateVehicleLockAPI,
  lockVehicleLockAPI,
  sendVehicleCommandAPI,
  unassignVehicleLockAPI,
  unlockVehicleLockAPI,
} from "@/services/mutations";
import type { VehicleListItem, VehicleLock } from "@/types";
import { formatDate, vehicleTitle } from "../utils";
import { ADMIN_PERMISSIONS } from "@/constants";

type PendingAction =
  | "lock"
  | "unlock"
  | "locate"
  | `vehicle_${VehicleControlCommand}`
  | "assign_existing"
  | "create_lock"
  | "edit_lock"
  | "unassign_lock";

const lockActions: {
  action: Extract<PendingAction, "lock" | "unlock">;
  label: string;
  permission: string | readonly string[];
  icon: LucideIcon;
  className: string;
}[] = [
  {
    action: "lock",
    label: "قفل",
    permission: ADMIN_PERMISSIONS.locks.lock,
    icon: Lock,
    className: "bg-red-50 text-red-600",
  },
  {
    action: "unlock",
    label: "فتح",
    permission: ADMIN_PERMISSIONS.locks.unlock,
    icon: Unlock,
    className: "bg-green-50 text-green-600",
  },
];

const vehicleCommandActions: {
  command: VehicleControlCommand;
  label: string;
  permission: string | readonly string[];
  icon: LucideIcon;
  className: string;
}[] = [
  {
    command: "lock",
    label: "قفل المركبة",
    permission: ADMIN_PERMISSIONS.vehicles.lock,
    icon: Lock,
    className: "bg-red-50 text-red-600",
  },
  {
    command: "unlock",
    label: "فتح المركبة",
    permission: ADMIN_PERMISSIONS.vehicles.unlock,
    icon: Unlock,
    className: "bg-green-50 text-green-700",
  },
  {
    command: "locate",
    label: "تحديث الموقع",
    permission: ADMIN_PERMISSIONS.vehicles.locate,
    icon: MapPin,
    className: "bg-blue-50 text-blue-600",
  },
  {
    command: "sound_alarm",
    label: "تشغيل الجرس",
    permission: ADMIN_PERMISSIONS.vehicles.ring,
    icon: Volume2,
    className: "bg-amber-50 text-orange-600",
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
  const [editingLock, setEditingLock] = useState(false);
  const [editLockDeviceId, setEditLockDeviceId] = useState("");
  const [editDeviceIdError, setEditDeviceIdError] = useState(false);
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
  const isBusy = Boolean(pendingAction);

  if (!vehicle) return null;

  const currentVehicle = vehicle;
  const hasVehicleDevice = Boolean(currentVehicle.iot_device_id?.trim());

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
    const selectedLock = unassignedLocks.find(
      (lock) => lock.id === selectedLockId,
    );
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
      showSuccessModal(result.message || "تم ربط القفل بالمركبة بنجاح");
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
      showSuccessModal(result.message || "تم إنشاء القفل وربطه بالمركبة بنجاح");
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
      showSuccessModal(result.message || "تم فك ربط القفل من المركبة");
      await refreshLockState();
      return;
    }

    toast.error(result?.message || "فشل فك ربط القفل من المركبة");
  }

  function beginEditingLock() {
    if (!assignedLock || isBusy) return;
    setEditLockDeviceId(assignedLock.device_id);
    setEditDeviceIdError(false);
    setEditingLock(true);
  }

  async function saveLockDeviceId() {
    if (!assignedLock || isBusy) return;
    const deviceId = editLockDeviceId.trim();
    if (!isGatewayDeviceId(deviceId)) {
      setEditDeviceIdError(true);
      return;
    }

    setEditDeviceIdError(false);
    setPendingAction("edit_lock");
    const result = await editVehicleLockAPI(assignedLock.id, {
      device_id: deviceId,
    });
    setPendingAction(null);

    if (result?.ok) {
      setEditingLock(false);
      showSuccessModal(result.message || "تم تحديث معرف جهاز القفل بنجاح");
      await refreshLockState();
      return;
    }

    toast.error(result?.message || "تعذر تحديث معرف جهاز القفل");
  }

  async function dispatchLock(action: "lock" | "unlock") {
    if (isBusy || !assignedLock) return;
    setPendingAction(action);
    const result =
      action === "lock"
        ? await lockVehicleLockAPI(assignedLock.id)
        : await unlockVehicleLockAPI(assignedLock.id);
    setPendingAction(null);
    if (result?.ok) {
      showSuccessModal(result.message || commandSuccessMessage(action));
      await refreshLockState();
      return;
    }

    toast.error(vehicleCommandErrorMessage(result, action));
  }

  async function dispatchLocate() {
    if (isBusy || !assignedLock) return;
    setPendingAction("locate");
    const result = await locateVehicleLockAPI(assignedLock.id);
    setPendingAction(null);

    if (result?.ok) {
      showSuccessModal(result.message || commandSuccessMessage("locate"));
      await refreshLockState();
      return;
    }

    toast.error(vehicleCommandErrorMessage(result, "locate"));
  }

  async function dispatchVehicleCommand(command: VehicleControlCommand) {
    if (isBusy || !hasVehicleDevice) return;
    setPendingAction(`vehicle_${command}`);
    const result = await sendVehicleCommandAPI(currentVehicle.id, {
      command,
      ...(command === "sound_alarm" ? { params: { duration: 5 } } : {}),
    });
    setPendingAction(null);

    if (result?.ok) {
      toast.success(result.message || commandSuccessMessage(command));
      await refreshLockState();
      return;
    }

    toast.error(vehicleCommandErrorMessage(result, command));
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
                  <p
                    role="alert"
                    className="rounded-xl bg-amber-50 p-3 text-sm text-orange-700"
                  >
                    معرف القفل ليس UUID صالحًا. استخدم معرف الجهاز من وحدة Vego
                    IoT.
                  </p>
                )}
                <PermissionGate slug={ADMIN_PERMISSIONS.locks.edit}>
                  {editingLock ? (
                    <div className="space-y-2 rounded-xl border border-primary/20 bg-white p-3">
                      <label className="block text-sm text-dark-gray">
                        معرف الجهاز من وحدة Vego IoT
                        <input
                          value={editLockDeviceId}
                          onChange={(event) => {
                            setEditLockDeviceId(event.target.value);
                            setEditDeviceIdError(false);
                          }}
                          disabled={isBusy}
                          placeholder="3fcbff96-04c0-4803-a24f-6f6aba32f8e7"
                          dir="ltr"
                          className="mt-2 h-11 w-full rounded-xl border border-primary/15 bg-background px-3 text-left text-sm outline-none transition focus:border-primary"
                        />
                      </label>
                      <p className="text-xs text-gray">استخدم UUID الجهاز من وحدة Vego IoT، وليس الرقم التسلسلي أو الاسم.</p>
                      {editDeviceIdError && (
                        <p role="alert" className="text-xs text-red-600">يجب إدخال UUID صالح للجهاز.</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isBusy || !editLockDeviceId.trim()}
                          onClick={saveLockDeviceId}
                          className="flex min-h-10 flex-1 items-center justify-center rounded-xl bg-secondary px-3 text-sm font-medium text-white disabled:opacity-60"
                        >
                          {pendingAction === "edit_lock" ? <Loader /> : "حفظ المعرف"}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setEditingLock(false)}
                          className="min-h-10 rounded-xl bg-background px-4 text-sm font-medium text-secondary disabled:opacity-60"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={beginEditingLock}
                      className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-secondary transition hover:bg-primary/10 disabled:opacity-60"
                    >
                      <Pencil className="size-4" />
                      تعديل معرف جهاز القفل
                    </button>
                  )}
                </PermissionGate>
                <InfoRow
                  label="آخر اتصال"
                  value={formatDate(assignedLock.last_seen_at ?? undefined)}
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
                  value={formatDate(
                    assignedLock.last_location_date ?? undefined,
                  )}
                />
              </div>

              <PermissionGate slug={ADMIN_PERMISSIONS.locks.locate}>
                <button
                  type="button"
                  disabled={isBusy}
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
                          disabled={isBusy || isCurrentState}
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
                      disabled={isLoadingUnassignedLocks || isBusy}
                      className="h-11 w-full rounded-xl border border-primary/15 bg-background px-3 text-right text-sm outline-none transition focus:border-primary"
                    >
                      <option value="">
                        {isLoadingUnassignedLocks
                          ? "جاري تحميل الأقفال..."
                          : "اختر القفل"}
                      </option>
                      {unassignedLocks.map((lock) => (
                        <option
                          key={lock.id}
                          value={lock.id}
                          disabled={!isGatewayDeviceId(lock.device_id)}
                        >
                          {lock.device_id}
                          {isGatewayDeviceId(lock.device_id)
                            ? ""
                            : " — معرف غير صالح"}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    disabled={
                      isBusy || isLoadingUnassignedLocks || !selectedLockId
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
                    <span className="mt-1 block text-xs text-gray">
                      استخدم UUID الجهاز من وحدة Vego IoT.
                    </span>
                    {deviceIdError && (
                      <span
                        role="alert"
                        className="mt-1 block text-xs text-red-600"
                      >
                        يجب إدخال UUID صالح للجهاز.
                      </span>
                    )}
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
            أوامر المركبة المباشرة
          </h4>
          <p className="text-xs leading-5 text-gray">
            تظهر كل عملية وفق صلاحيتها الخاصة، وتبقى صلاحية Admin Command Vehicles مقبولة لجميع العمليات.
          </p>
          <InfoRow label="معرف الجهاز" value={vehicle.iot_device_id ?? "-"} />

          {!hasVehicleDevice ? (
            <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
              لا يوجد جهاز IoT مباشر للمركبة، لذلك لا يمكن إرسال أوامر المركبة. القفل المربوط أعلاه يعمل بشكل مستقل.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {vehicleCommandActions.map(
                ({ command, label, permission, icon: Icon, className }) => (
                  <PermissionGate key={command} slug={permission}>
                    <button
                      type="button"
                      disabled={isBusy}
                      aria-busy={pendingAction === `vehicle_${command}`}
                      onClick={() => dispatchVehicleCommand(command)}
                      className={cn(
                        "flex min-h-20 items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60",
                        className,
                      )}
                    >
                      {pendingAction === `vehicle_${command}` ? (
                        <Loader />
                      ) : (
                        <Icon className="size-6 shrink-0" />
                      )}
                      {label}
                    </button>
                  </PermissionGate>
                ),
              )}
            </div>
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

function commandSuccessMessage(type: VehicleControlCommand) {
  if (type === "lock") return "أكد الجهاز قفل المركبة بنجاح";
  if (type === "unlock") return "أكد الجهاز فتح المركبة بنجاح";
  if (type === "locate") return "أكد الجهاز تحديث موقع المركبة بنجاح";
  return "أكد الجهاز تشغيل الجرس بنجاح";
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

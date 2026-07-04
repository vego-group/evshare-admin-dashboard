"use client";

import { useState } from "react";
import { Lock, Unlock, Volume2, type LucideIcon } from "lucide-react";
import toast from "react-hot-toast";

import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import type { VehicleCommandValues } from "@/schemas/vehicle-operating-pricing";
import { sendVehicleCommandAPI } from "@/services/mutations";
import type { VehicleListItem } from "@/types";
import { vehicleTitle } from "../utils";

const commands: {
  command: VehicleCommandValues["command"];
  label: string;
  icon: LucideIcon;
  className: string;
}[] = [
  {
    command: "lock",
    label: "قفل",
    icon: Lock,
    className: "bg-red-50 text-red-600",
  },
  {
    command: "unlock",
    label: "فتح",
    icon: Unlock,
    className: "bg-green-50 text-green-600",
  },
  {
    command: "sound_alarm",
    label: "تشغيل الجرس",
    icon: Volume2,
    className: "bg-amber-50 text-orange-500",
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
  const [pendingCommand, setPendingCommand] = useState<
    VehicleCommandValues["command"] | null
  >(null);
  if (!vehicle) return null;

  const hasDevice = Boolean(vehicle.iot_device_id);

  async function dispatch(command: VehicleCommandValues["command"]) {
    if (pendingCommand) return;
    setPendingCommand(command);
    const result = await sendVehicleCommandAPI(vehicle!.id, { command });
    setPendingCommand(null);
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
      contentClassName="max-w-lg"
    >
      <div className="space-y-4 p-1">
        <p className="text-sm text-dark-gray">
          معرف الجهاز: <span dir="ltr">{vehicle.iot_device_id ?? "-"}</span>
        </p>

        {!hasDevice ? (
          <p className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">
            لا يوجد جهاز IoT مربوط بهذه المركبة، لا يمكن إرسال أوامر إليها.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {commands.map(({ command, label, icon: Icon, className }) => (
              <button
                key={command}
                type="button"
                disabled={Boolean(pendingCommand)}
                onClick={() => dispatch(command)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl p-4 text-sm font-medium transition hover:brightness-95 disabled:opacity-60",
                  className,
                )}
              >
                {pendingCommand === command ? (
                  <Loader />
                ) : (
                  <Icon className="size-6" />
                )}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default CommandPanelModal;

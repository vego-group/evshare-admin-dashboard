import { getApiErrorCode, getRequiredPermissions } from "./api-error";

export type VehicleControlCommand = "lock" | "unlock" | "locate" | "ring" | "sound_alarm";

type CommandResult = {
  error?: unknown;
  message?: string;
  status?: number;
};

const fallbackByCommand: Record<VehicleControlCommand, string> = {
  lock: "فشل قفل المركبة",
  unlock: "فشل فتح المركبة",
  locate: "فشل تحديد موقع المركبة",
  ring: "فشل تشغيل جرس المركبة",
  sound_alarm: "فشل تشغيل جرس المركبة",
};

/**
 * Maps stable API error codes to operator-facing messages. HTTP 503 by itself
 * is deliberately not treated as an authorization failure: authorization is
 * represented only by AUTH_PERMISSION_DENIED.
 */
export function vehicleCommandErrorMessage(
  result: CommandResult,
  command: VehicleControlCommand,
) {
  const code = getApiErrorCode(result.error);
  const backendMessage = result.message?.trim();

  if (code === "AUTH_PERMISSION_DENIED") {
    const required = getRequiredPermissions(result.error);
    if (backendMessage) {
      return required.length
        ? `${backendMessage} (${required.join("، ")})`
        : backendMessage;
    }
    return required.length
      ? `لا تملك الصلاحية المطلوبة: ${required.join("، ")}`
      : "لا تملك صلاحية تنفيذ هذا الإجراء";
  }

  if (code === "iot_device_offline") {
    return backendMessage || "القفل غير متصل حالياً. تأكد من قرب المركبة وحاول مرة أخرى.";
  }
  if (code === "iot_command_timeout") {
    return backendMessage || "لم يستجب القفل في الوقت المحدد. حاول مرة أخرى.";
  }
  if (code === "iot_command_rejected") {
    return backendMessage || "رفض القفل الأمر. تحقق من حالة الجهاز وحاول مرة أخرى.";
  }

  return backendMessage || fallbackByCommand[command];
}

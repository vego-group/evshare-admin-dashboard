import type { TripMutationError } from "@/types";

const errorCodeMessages: Record<string, string> = {
  lock_open:
    "القفل ما زال مفتوحاً، لذلك بقيت الرحلة نشطة واستمرت الفوترة. أغلق القفل فعلياً أو استخدم أمر القفل، ثم أعد إنهاء الرحلة.",
  lock_status_unavailable:
    "تعذر التحقق من أن القفل مغلق، لذلك بقيت الرحلة نشطة ولم تتم التسوية. افحص اتصال القفل وحالته ثم أعد المحاولة.",
  iot_device_offline:
    "جهاز القفل غير متصل. لم يُرسل الأمر ولم تتغير الرحلة أو المحفظة. افحص اتصال الجهاز ثم أعد المحاولة.",
  iot_command_timeout:
    "انتهت مهلة الاتصال ببوابة IoT ولم تتغير الرحلة أو المحفظة. تحقق من البوابة واتصال الجهاز ثم أعد المحاولة.",
  iot_command_rejected:
    "رفضت بوابة IoT الأمر ولم تتغير الرحلة أو المحفظة. راجع معرف الجهاز واستجابة البوابة ثم أعد المحاولة.",
};

export function formatTripActionError(
  fallbackMessage?: string,
  error?: TripMutationError,
) {
  const reason = Array.isArray(error?.errors?.reason)
    ? error.errors.reason.join(" ")
    : error?.errors?.reason;
  const statusReason = Array.isArray(error?.errors?.status_reason)
    ? error.errors.status_reason.join(" ")
    : error?.errors?.status_reason;
  const codeMessage = error?.error_code
    ? errorCodeMessages[error.error_code]
    : undefined;
  const reference = error?.correlation_id
    ? `رقم التتبع: ${error.correlation_id}`
    : null;

  return [
    codeMessage ||
      error?.message ||
      fallbackMessage ||
      "تعذر تنفيذ الإجراء. يمكنك المحاولة مرة أخرى بأمان.",
    reason,
    statusReason,
    reference,
  ]
    .filter(Boolean)
    .join(" — ");
}

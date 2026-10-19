export const USER_REMOVAL_REASON_MIN_LENGTH = 3;
export const USER_REMOVAL_REASON_MAX_LENGTH = 1000;

export function normalizeUserRemovalReason(reason: string) {
  return reason.trim();
}

export function getUserRemovalReasonError(reason: string) {
  const length = normalizeUserRemovalReason(reason).length;

  if (length < USER_REMOVAL_REASON_MIN_LENGTH) {
    return "سبب الإزالة مطلوب ويجب ألا يقل عن 3 أحرف";
  }

  if (length > USER_REMOVAL_REASON_MAX_LENGTH) {
    return "سبب الإزالة يجب ألا يتجاوز 1000 حرف";
  }

  return null;
}

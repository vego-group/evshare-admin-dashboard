export const API_ERROR_CODES = {
  tokenMissing: "AUTH_TOKEN_MISSING",
  tokenMalformed: "AUTH_TOKEN_MALFORMED",
  tokenExpired: "AUTH_TOKEN_EXPIRED",
  tokenRevoked: "AUTH_TOKEN_REVOKED",
  accountSuspended: "AUTH_ACCOUNT_SUSPENDED",
  tenantMismatch: "AUTH_TENANT_MISMATCH",
  roleForbidden: "AUTH_ROLE_FORBIDDEN",
  permissionDenied: "AUTH_PERMISSION_DENIED",
  sessionIncomplete: "AUTH_SESSION_INCOMPLETE",
  otpInvalid: "OTP_INVALID",
  otpExpired: "OTP_EXPIRED",
  otpAttemptsExceeded: "OTP_ATTEMPTS_EXCEEDED",
  otpResendThrottled: "OTP_RESEND_THROTTLED",
  unsupportedCurrency: "UNSUPPORTED_CURRENCY",
  currencyMismatch: "CURRENCY_MISMATCH",
  currencyImmutable: "CURRENCY_IMMUTABLE",
  crossCurrencyOperation: "CROSS_CURRENCY_OPERATION",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES] | (string & {});

export type ApiErrorEnvelope = {
  error?: boolean;
  code?: ApiErrorCode;
  error_code?: ApiErrorCode;
  message?: string;
  details?: Record<string, unknown> | null;
  data?: unknown;
  retry_after_seconds?: number;
};

export function getApiErrorCode(payload: unknown): ApiErrorCode | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const value = payload as ApiErrorEnvelope;
  const code = value.code || value.error_code;
  return typeof code === "string" && code.length > 0 ? code : undefined;
}

export function getRetryAfterSeconds(payload: unknown): number | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const value = Number((payload as ApiErrorEnvelope).retry_after_seconds);
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : undefined;
}

export function getRequiredPermissions(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];
  const details = (payload as ApiErrorEnvelope).details;
  if (!details || !Array.isArray(details.required)) return [];
  return details.required.filter((item): item is string => typeof item === "string");
}

export const getPayloadMessage = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== "object") return undefined;
  const maybeMessage = (payload as { message?: unknown }).message;
  return typeof maybeMessage === "string" ? maybeMessage : undefined;
};

export const getHttpErrorStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== "object") return undefined;

  const directStatus = (error as { status?: unknown }).status;
  if (typeof directStatus === "number") return directStatus;

  const response = (error as { response?: unknown }).response;
  if (!response || typeof response !== "object") return undefined;
  const responseStatus = (response as { status?: unknown }).status;
  return typeof responseStatus === "number" ? responseStatus : undefined;
};

export const getValidationErrors = (payload: unknown): string[] => {
  if (!payload || typeof payload !== "object") return [];
  const base = (payload as { error?: unknown }).error ?? payload;
  if (!base || typeof base !== "object") return [];
  const errors = (base as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return [];
  return Object.values(errors).flatMap((value) => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }
    if (typeof value === "string") return [value];
    return [];
  });
};

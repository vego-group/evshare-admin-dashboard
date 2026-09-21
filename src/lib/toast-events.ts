export const TOAST_SUCCESS_EVENT = "evshare:toast-success";
export const FORBIDDEN_EVENT = "evshare:forbidden";

export function notifyForbidden(payload?: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FORBIDDEN_EVENT, { detail: payload }));
}

export const TOAST_SUCCESS_EVENT = "evshare:toast-success";
export const FORBIDDEN_EVENT = "evshare:forbidden";

export function notifyForbidden() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FORBIDDEN_EVENT));
}

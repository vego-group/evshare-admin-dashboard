export const TOAST_SUCCESS_EVENT = "evshare:toast-success";
export const FORBIDDEN_EVENT = "evshare:forbidden";
export const NETWORK_OFFLINE_EVENT = "evshare:network-offline";

export function notifyForbidden(payload?: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FORBIDDEN_EVENT, { detail: payload }));
}

export function notifyOffline() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NETWORK_OFFLINE_EVENT));
}

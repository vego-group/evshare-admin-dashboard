export function confirmPricingChange(message: string) {
  if (typeof window === "undefined") return true;
  return window.confirm(message);
}

import type { ClipboardEvent, KeyboardEvent } from "react";

const allowedControlKeys = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

export function preventNonDigitInput(event: KeyboardEvent<HTMLInputElement>) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (allowedControlKeys.has(event.key)) return;
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}

export function preventNonDigitPaste(event: ClipboardEvent<HTMLInputElement>) {
  const pastedValue = event.clipboardData.getData("text");
  if (!/^\d*$/.test(pastedValue)) {
    event.preventDefault();
  }
}

export function stripNonDigits(value: string) {
  return value.replace(/\D/g, "");
}

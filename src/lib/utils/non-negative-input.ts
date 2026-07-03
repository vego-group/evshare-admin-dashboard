import type { ClipboardEvent, KeyboardEvent } from "react";

type NonNegativeInputOptions = {
  allowDecimal?: boolean;
};

const blockedKeys = new Set(["-", "+", "e", "E"]);

export function preventNegativeNumberInput(
  event: KeyboardEvent<HTMLInputElement>,
) {
  if (blockedKeys.has(event.key)) {
    event.preventDefault();
  }
}

export function preventNegativeNumberPaste(
  event: ClipboardEvent<HTMLInputElement>,
  options: NonNegativeInputOptions = {},
) {
  const pastedValue = event.clipboardData.getData("text");
  if (!isNonNegativeNumericInput(pastedValue, options)) {
    event.preventDefault();
  }
}

export function normalizeNonNegativeNumberInput(
  value: string,
  options: NonNegativeInputOptions = {},
) {
  const decimalSeparator = options.allowDecimal ? "." : "";
  const allowedPattern = new RegExp(`[^0-9${decimalSeparator}]`, "g");
  let normalized = value.replace(allowedPattern, "");

  if (options.allowDecimal) {
    const [integerPart, ...decimalParts] = normalized.split(".");
    normalized =
      decimalParts.length > 0
        ? `${integerPart}.${decimalParts.join("")}`
        : integerPart;
  }

  return normalized;
}

function isNonNegativeNumericInput(
  value: string,
  options: NonNegativeInputOptions,
) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return true;

  const pattern = options.allowDecimal ? /^\d*\.?\d*$/ : /^\d+$/;
  return pattern.test(trimmedValue);
}

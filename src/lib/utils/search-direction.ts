const PHONE_SEARCH_CHARS_PATTERN = /^[+\d\s()-]+$/;

export function isPhoneLikeSearchValue(value: string) {
  const trimmedValue = value.trim();
  const digitCount = trimmedValue.replace(/\D/g, "").length;

  return digitCount >= 3 && PHONE_SEARCH_CHARS_PATTERN.test(trimmedValue);
}

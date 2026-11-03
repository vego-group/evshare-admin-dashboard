export function isTripWalletReference(type?: string | null) {
  if (!type) return false;

  const normalized = type
    .replaceAll("\\", "/")
    .split("/")
    .at(-1)
    ?.toLowerCase();

  return normalized === "trip";
}

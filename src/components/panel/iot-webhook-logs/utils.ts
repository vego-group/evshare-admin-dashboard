export function formatIotWebhookDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatIotWebhookValue(value?: string | null) {
  return value?.trim() || "-";
}

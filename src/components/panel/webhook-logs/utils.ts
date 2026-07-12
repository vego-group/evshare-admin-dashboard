export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatGateway(value?: string) {
  if (!value) return "-";
  if (value.toLowerCase() === "myfatoorah") return "MyFatoorah";
  if (value.toLowerCase() === "moyasar") return "Moyasar";
  if (value.toLowerCase() === "tamara") return "Tamara";
  return value;
}

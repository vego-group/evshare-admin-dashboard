import type { VatStatus } from "@/types";

export const vatStatusOptions: { label: string; value: VatStatus }[] = [
  { label: "قيد الانتظار", value: "pending" },
  { label: "مستحق", value: "due" },
  { label: "مسدد جزئياً", value: "partially_paid" },
  { label: "مسدد بالكامل", value: "paid" },
  { label: "متأخر", value: "overdue" },
];

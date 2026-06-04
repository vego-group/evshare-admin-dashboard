import { cn } from "@/lib/utils";
import type { WalletTransactionStatus } from "@/types";

const STATUS_STYLES: Record<WalletTransactionStatus, string> = {
  pending: "bg-amber-50 text-orange-500",
  completed: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-500",
};

const STATUS_LABELS: Record<WalletTransactionStatus, string> = {
  pending: "قيد الانتظار",
  completed: "مكتمل",
  rejected: "مرفوض",
};

export function WalletStatusBadge({ status }: { status: WalletTransactionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

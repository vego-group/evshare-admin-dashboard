import { cn } from "@/lib/utils";
import type { PaymentTransactionStatus } from "@/types";

import { formatTransactionStatus } from "../utils";

export function ProcessedBadge({ isProcessed }: { isProcessed: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        isProcessed ? "bg-green-50 text-green" : "bg-amber-50 text-orange-500",
      )}
    >
      {isProcessed ? "معالج" : "غير معالج"}
    </span>
  );
}

export function TransactionStatusBadge({
  status,
}: {
  status: PaymentTransactionStatus;
}) {
  const styles: Record<string, string> = {
    paid: "bg-green-50 text-green",
    succeeded: "bg-green-50 text-green",
    failed: "bg-red-50 text-red",
    initiated: "bg-amber-50 text-orange-500",
    authorized: "bg-blue/10 text-blue",
    captured: "bg-green-50 text-green",
    refunded: "bg-purple-50 text-purple-700",
    voided: "bg-neutral-100 text-gray",
    expired: "bg-neutral-100 text-gray",
  };

  return (
    <span
      className={cn(
        "inline-flex h-[34px] items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        styles[status] ?? "bg-primary/10 text-primary",
      )}
    >
      {formatTransactionStatus(status)}
    </span>
  );
}

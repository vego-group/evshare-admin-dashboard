import type { ReactNode } from "react";

import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  ReceiptText,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  PaymentCheckout,
  PaymentTransactionsAnalytics,
} from "@/types";

import { MoneyValue } from "../utils";

export function CheckoutStatsCards({
  checkouts,
}: {
  checkouts: PaymentCheckout[];
}) {
  const processed = checkouts.filter(
    (checkout) => checkout.is_processed,
  ).length;
  const unprocessed = checkouts.length - processed;
  const totalAmount = checkouts.reduce(
    (sum, checkout) => sum + Number(checkout.amount || 0),
    0,
  );

  return (
    <StatsGrid
      cards={[
        {
          label: "المعروض",
          value: checkouts.length,
          icon: <CreditCard className="size-5 text-primary" />,
          iconBg: "bg-primary/10",
        },
        {
          label: "معالج",
          value: processed,
          icon: <CheckCircle2 className="size-5 text-green" />,
          iconBg: "bg-green-50",
        },
        {
          label: "غير معالج",
          value: unprocessed,
          icon: <Clock3 className="size-5 text-orange-500" />,
          iconBg: "bg-amber-50",
        },
        {
          label: "إجمالي المبالغ",
          value: <MoneyValue amount={totalAmount} />,
          icon: <CircleDollarSign className="size-5 text-blue" />,
          iconBg: "bg-blue/10",
        },
      ]}
    />
  );
}

export function TransactionStatsCards({
  analytics,
}: {
  analytics?: PaymentTransactionsAnalytics;
}) {
  return (
    <StatsGrid
      cards={[
        {
          label: "الإجمالي",
          value: analytics?.total ?? 0,
          icon: <ReceiptText className="size-5 text-primary" />,
          iconBg: "bg-primary/10",
        },
        {
          label: "مدفوع",
          value: analytics?.paid ?? 0,
          icon: <CheckCircle2 className="size-5 text-green" />,
          iconBg: "bg-green-50",
        },
        {
          label: "قيد البدء",
          value: analytics?.initiated ?? 0,
          icon: <Clock3 className="size-5 text-orange-500" />,
          iconBg: "bg-amber-50",
        },
        {
          label: "فشل",
          value: analytics?.failed ?? 0,
          icon: <XCircle className="size-5 text-red" />,
          iconBg: "bg-red-50",
        },
      ]}
    />
  );
}

function StatsGrid({
  cards,
}: {
  cards: {
    label: string;
    value: number | ReactNode;
    icon: ReactNode;
    iconBg: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p className="whitespace-nowrap text-sm font-normal leading-5 text-gray">
              {card.label}
            </p>
            <p
              dir="ltr"
              className="text-2xl text-right font-semibold leading-8 text-secondary"
            >
              {typeof card.value === "number"
                ? card.value.toLocaleString("en-US")
                : card.value}
            </p>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px]",
              card.iconBg,
            )}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

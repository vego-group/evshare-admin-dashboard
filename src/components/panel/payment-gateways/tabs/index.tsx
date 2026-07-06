import type { ReactNode } from "react";

import { CreditCard, ReceiptText } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PaymentGatewayTab } from "@/types";

type PaymentGatewayTabsProps = {
  activeTab: PaymentGatewayTab;
  availableTabs: PaymentGatewayTab[];
  onChange: (tab: PaymentGatewayTab) => void;
};

function PaymentGatewayTabs({ activeTab, availableTabs, onChange }: PaymentGatewayTabsProps) {
  const allTabs: { label: string; value: PaymentGatewayTab; icon: ReactNode }[] = [
    {
      label: "عمليات التحقق",
      value: "checkouts",
      icon: <CreditCard className="size-4" />,
    },
    {
      label: "المعاملات",
      value: "transactions",
      icon: <ReceiptText className="size-4" />,
    },
  ];
  const tabs = allTabs.filter((tab) => availableTabs.includes(tab.value));

  if (tabs.length < 2) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:w-fit sm:flex-row">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-medium text-dark-gray transition",
            activeTab === tab.value
              ? "bg-primary text-white"
              : "hover:bg-primary/8",
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default PaymentGatewayTabs;

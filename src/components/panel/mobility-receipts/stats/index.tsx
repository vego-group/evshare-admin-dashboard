import { CheckCircle2, Clock3, FileWarning, ScrollText } from "lucide-react";

import type { MobilityReceipt } from "@/types";

const stats = [
  { key: "total", label: "إجمالي السندات", icon: ScrollText, className: "bg-blue-50 text-blue-600" },
  { key: "withTemplate", label: "قوالب مرفوعة", icon: CheckCircle2, className: "bg-green-50 text-green-600" },
  { key: "pending", label: "بانتظار المراجعة", icon: Clock3, className: "bg-amber-50 text-amber-600" },
  { key: "rejected", label: "مرفوضة", icon: FileWarning, className: "bg-red-50 text-red-600" },
] as const;

function MobilityReceiptsStats({ receipts = [] }: { receipts?: MobilityReceipt[] }) {
  const values = {
    total: receipts.length,
    withTemplate: receipts.filter((receipt) => receipt.contract_template?.length).length,
    pending: receipts.filter((receipt) => receipt.activation_status === "pending_admin_approval").length,
    rejected: receipts.filter((receipt) => receipt.activation_status === "contract_rejected").length,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.key} className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5">
            <div className="min-w-0 flex flex-col gap-1">
              <p className="whitespace-nowrap text-sm font-normal leading-5 text-gray">{stat.label}</p>
              <p className="truncate text-2xl font-semibold leading-8 text-secondary">{values[stat.key]}</p>
            </div>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${stat.className}`}>
              <Icon className="size-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MobilityReceiptsStats;

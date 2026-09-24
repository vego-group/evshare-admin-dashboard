import type { VehicleListItem } from "@/types";

const statusLabels = { draft: "مسودة", pending_device: "بانتظار الجهاز", ready: "جاهزة" } as const;
const missingLabels = { owner: "المالك", operation_company: "شركة التشغيل", pricing: "التسعير", device: "الجهاز" } as const;

export default function ProvisioningBadge({ vehicle }: { vehicle: VehicleListItem }) {
  const status = vehicle.provisioning?.status ?? vehicle.provisioning_status;
  if (!status) return null;
  const missing = vehicle.provisioning?.missing ?? [];
  return <div className="flex flex-wrap gap-1 text-xs">
    <span className={`w-fit shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 font-medium ${status === "ready" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-orange-700"}`}>{statusLabels[status]}</span>
    {missing.map((item) => <span key={item} className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">ينقص: {missingLabels[item]}</span>)}
  </div>;
}

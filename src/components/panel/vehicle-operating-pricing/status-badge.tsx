import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  pending_admin_approval: "بانتظار الموافقة",
  pending_contract_upload: "بانتظار رفع العقد",
  working: "يعمل",
  contract_rejected: "العقد مرفوض",
  new: "جديد",
  draft: "مسودة",
  active: "نشط",
  disabled: "معطل",
  maintenance: "صيانة",
  suspended: "موقوف",
  in_use: "قيد الاستخدام",
  template_uploaded: "تم رفع القالب",
  template_missing: "لا يوجد قالب",
};

const statusClassNames: Record<string, string> = {
  pending_admin_approval: "bg-amber-50 text-amber-600",
  pending_contract_upload: "bg-orange-50 text-orange-600",
  working: "bg-green-50 text-green-600",
  contract_rejected: "bg-red-50 text-red-600",
  new: "bg-blue-50 text-blue-600",
  draft: "bg-slate-100 text-slate-600",
  active: "bg-green-50 text-green-600",
  disabled: "bg-gray-100 text-dark-gray",
  maintenance: "bg-yellow-50 text-yellow-700",
  suspended: "bg-red-50 text-red-600",
  in_use: "bg-blue-50 text-blue-600",
  template_uploaded: "bg-green-50 text-green-600",
  template_missing: "bg-gray-100 text-dark-gray",
};

function StatusBadge({ status }: { status?: string }) {
  const value = status || "-";
  return (
    <span
      className={cn(
        "inline-flex h-8 w-fit items-center rounded-full px-3 text-xs font-medium",
        statusClassNames[value] || "bg-gray-100 text-dark-gray",
      )}
    >
      {statusLabels[value] || value}
    </span>
  );
}

export default StatusBadge;

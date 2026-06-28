import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  draft: "مسودة",
  pending_contract_upload: "بانتظار رفع العقد",
  pending_admin_approval: "بانتظار الموافقة",
  contract_rejected: "العقد مرفوض",
  working: "معتمد",
  new: "جديد",
  active: "نشط",
  disabled: "معطل",
  maintenance: "صيانة",
  suspended: "موقوف",
  in_use: "قيد الاستخدام",
  template_uploaded: "تم رفع القالب",
  template_missing: "لا يوجد قالب",
};

const classNames: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  pending_contract_upload: "bg-orange-50 text-orange-600",
  pending_admin_approval: "bg-amber-50 text-amber-600",
  contract_rejected: "bg-red-50 text-red-600",
  working: "bg-green-50 text-green-600",
  active: "bg-green-50 text-green-600",
  new: "bg-blue-50 text-blue-600",
  disabled: "bg-gray-100 text-dark-gray",
  maintenance: "bg-yellow-50 text-yellow-700",
  suspended: "bg-red-50 text-red-600",
  in_use: "bg-blue-50 text-blue-600",
  template_uploaded: "bg-green-50 text-green-600",
  template_missing: "bg-gray-100 text-dark-gray",
};

function MobilityReceiptStatusBadge({ status }: { status?: string | null }) {
  const value = status || "-";
  return (
    <span
      className={cn(
        "inline-flex h-8 w-fit items-center rounded-full px-3 text-xs font-medium",
        classNames[value] || "bg-gray-100 text-dark-gray",
      )}
    >
      {labels[value] || value}
    </span>
  );
}

export default MobilityReceiptStatusBadge;

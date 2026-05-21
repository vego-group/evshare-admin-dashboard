import { CheckCircle2, Package, PauseCircle, TrendingUp } from "lucide-react";

export const statConfig = [
  {
    label: "إجمالي المنتجات",
    key: "total_products",
    icon: Package,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "منتجات نشطة",
    key: "active_products",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "منتجات غير نشطة",
    key: "inactive_products",
    icon: PauseCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
  {
    label: "معدل التشغيل",
    key: "working_rate",
    icon: TrendingUp,
    iconClassName: "bg-amber-50 text-orange-500",
  },
] as const;

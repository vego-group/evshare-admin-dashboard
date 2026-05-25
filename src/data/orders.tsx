import { ShoppingCart, Sparkles, CheckCircle2, XCircle } from "lucide-react";

const statConfig = [
  {
    label: "إجمالي الطلبات",
    key: "total",
    icon: ShoppingCart,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "طلبات جديدة",
    key: "new",
    icon: Sparkles,
    iconClassName: "bg-amber-50 text-orange-500",
  },
  {
    label: "طلبات مكتملة",
    key: "completed",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "طلبات ملغية",
    key: "cancelled",
    icon: XCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
] as const;

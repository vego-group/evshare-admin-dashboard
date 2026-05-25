import { MapPin, CheckCircle2, PauseCircle, Star } from "lucide-react";

export const citiesStatConfig = [
  {
    label: "إجمالي المدن",
    key: "total_cities",
    icon: MapPin,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "مدن نشطة",
    key: "active_cities",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "مدن غير نشطة",
    key: "inactive_cities",
    icon: PauseCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
  {
    label: "الأكثر استخداما",
    key: "most_used_city",
    icon: Star,
    iconClassName: "bg-amber-50 text-orange-500",
  },
] as const;

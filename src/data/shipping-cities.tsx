import { CheckCircle2, Link2, Link2Off, MapPin } from "lucide-react";

export const shippingCitiesStatConfig = [
  {
    label: "إجمالي المدن",
    key: "total",
    icon: MapPin,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "مدن نشطة",
    key: "active",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "مدن مربوطة",
    key: "mapped",
    icon: Link2,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "مدن غير مربوطة",
    key: "unmapped",
    icon: Link2Off,
    iconClassName: "bg-amber-50 text-orange-500",
  },
] as const;

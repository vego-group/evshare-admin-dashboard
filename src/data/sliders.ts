import { Images, CheckCircle2, PauseCircle } from "lucide-react";

export const slidersStatConfig = [
  {
    label: "إجمالي السلايدرات",
    key: "total_slides",
    icon: Images,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "سلايدرات نشطة",
    key: "active_slides",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "سلايدرات غير نشطة",
    key: "inactive_slides",
    icon: PauseCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
] as const;

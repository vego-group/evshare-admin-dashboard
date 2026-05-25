import { FolderTree, CheckCircle2, PauseCircle, Star } from "lucide-react";

export const categoriesStatConfig = [
  {
    label: "إجمالي التصنيفات",
    key: "total_categories",
    icon: FolderTree,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "تصنيفات نشطة",
    key: "active_categories",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "تصنيفات غير نشطة",
    key: "inactive_categories",
    icon: PauseCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
  {
    label: "الأكثر استخداما",
    key: "most_used_category",
    icon: Star,
    iconClassName: "bg-amber-50 text-orange-500",
  },
] as const;

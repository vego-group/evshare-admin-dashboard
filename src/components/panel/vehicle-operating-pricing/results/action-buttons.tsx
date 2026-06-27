import {
  Eye,
  FileCheck2,
  Pencil,
  Percent,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  canUpdateCommission: boolean;
  onView: () => void;
  onEdit: () => void;
  onReview: () => void;
  onCommission: () => void;
  onDelete: () => void;
};

function VehicleActions({
  compact,
  canUpdateCommission,
  onView,
  onEdit,
  onReview,
  onCommission,
  onDelete,
}: Props) {
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full flex-wrap")}>
      <Action icon={Eye} label="عرض" onClick={onView} className="bg-blue-50 text-blue-600" />
      <Action icon={Pencil} label="تعديل" onClick={onEdit} className="bg-amber-50 text-orange-500" />
      <Action icon={FileCheck2} label="مراجعة العقد" onClick={onReview} className="bg-green-50 text-green-600" />
      {canUpdateCommission && <Action icon={Percent} label="العمولة" onClick={onCommission} className="bg-purple-50 text-purple-600" />}
      <Action icon={Trash2} label="حذف" onClick={onDelete} className="bg-red-50 text-red-500" />
    </div>
  );
}

function Action({ icon: Icon, label, onClick, className }: { icon: LucideIcon; label: string; onClick: () => void; className: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cn("grid size-8 place-items-center rounded-lg transition hover:brightness-95", className)}>
      <Icon className="size-4" />
    </button>
  );
}

export default VehicleActions;

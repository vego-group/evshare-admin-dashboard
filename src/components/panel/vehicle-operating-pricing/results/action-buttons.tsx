import {
  Eye,
  MapPin,
  MoreVertical,
  Pencil,
  Percent,
  Radio,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  canUpdateCommission: boolean;
  onView: () => void;
  onEdit: () => void;
  onCommission: () => void;
  onManageZone: () => void;
  onControlPanel: () => void;
  onDelete: () => void;
};

function VehicleActions({
  compact,
  canUpdateCommission,
  onView,
  onEdit,
  onCommission,
  onManageZone,
  onControlPanel,
  onDelete,
}: Props) {
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full flex-wrap")}>
      <PermissionGate slug={["Admin Locate Vehicles", "Admin View Locks", "Admin Lock Vehicles", "Admin Unlock Vehicles"]}>
        <button
          type="button"
          onClick={onControlPanel}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100",
            compact && "w-full justify-center",
          )}
        >
          <Radio className="size-4 shrink-0" />
          <span>لوحة التحكم</span>
        </button>
      </PermissionGate>
      <PermissionGate slug="Admin View Vehicles">
        <Action icon={Eye} label="عرض" onClick={onView} className="bg-blue-50 text-blue-600" />
      </PermissionGate>
      <PermissionGate slug="Admin Edit Vehicles">
        <Action icon={Pencil} label="تعديل" onClick={onEdit} className="bg-amber-50 text-orange-500" />
      </PermissionGate>
      <PermissionGate slug="Admin Delete Vehicles">
        <Action icon={Trash2} label="حذف" onClick={onDelete} className="bg-red-50 text-red-500" />
      </PermissionGate>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="المزيد من الإجراءات"
            className="grid size-8 place-items-center rounded-lg bg-primary/8 text-dark-gray transition hover:brightness-95"
          >
            <MoreVertical className="size-4 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {canUpdateCommission && (
            <PermissionGate slug="Admin View Operation Companies">
              <DropdownMenuItem onSelect={onCommission}>
                <Percent className="size-4 shrink-0 text-purple-600" />
                <span className="flex-1 truncate text-right">العمولة</span>
              </DropdownMenuItem>
            </PermissionGate>
          )}
          <PermissionGate slug="Admin View Zones">
            <DropdownMenuItem onSelect={onManageZone}>
              <MapPin className="size-4 shrink-0 text-indigo-600" />
              <span className="flex-1 truncate text-right">مناطق التشغيل</span>
            </DropdownMenuItem>
          </PermissionGate>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Action({ icon: Icon, label, onClick, className }: { icon: LucideIcon; label: string; onClick: () => void; className: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cn("grid size-8 place-items-center rounded-lg transition hover:brightness-95", className)}>
      <Icon className="size-4 shrink-0" />
    </button>
  );
}

export default VehicleActions;

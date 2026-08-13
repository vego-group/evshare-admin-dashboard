import { Ban, Eye, Pencil, RefreshCw, Trash2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ShipmentListItem } from "@/types";

import { isShipmentDeletable, isShipmentFinal } from "./shipment-status-rules";

export function ShipmentActions({
  shipment,
  onView,
  onEdit,
  onUpdateStatus,
  onCancel,
  onDelete,
}: {
  shipment: ShipmentListItem;
  onView: () => void;
  onEdit: () => void;
  onUpdateStatus: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const isFinal = isShipmentFinal(shipment.status);

  return (
    <div className="flex items-center gap-2">
      <ActionButton
        icon={Eye}
        onClick={onView}
        label="عرض الشحنة"
        className="bg-blue-50 text-blue-600"
      />
      <ActionButton
        icon={RefreshCw}
        onClick={onUpdateStatus}
        disabled={isFinal}
        label="تحديث حالة الشحنة"
        className="bg-indigo-50 text-indigo-600"
      />
      <ActionButton
        icon={Pencil}
        onClick={onEdit}
        disabled={isFinal}
        label="تعديل الشحنة"
        className="bg-amber-50 text-orange-500"
      />
      <ActionButton
        icon={Ban}
        onClick={onCancel}
        disabled={!shipment.is_cancellable}
        label="إلغاء الشحنة"
        className="bg-gray-100 text-dark-gray"
      />
      <ActionButton
        icon={Trash2}
        onClick={onDelete}
        disabled={!isShipmentDeletable(shipment.status)}
        label="حذف الشحنة"
        className="bg-red-50 text-red-500"
      />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  className,
  label,
  disabled = false,
  onClick,
}: {
  icon: LucideIcon;
  className: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg transition hover:brightness-95",
        disabled && "cursor-not-allowed opacity-40 hover:brightness-100",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
    </button>
  );
}

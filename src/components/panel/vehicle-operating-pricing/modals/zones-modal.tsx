"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { deleteVehicleZoneAPI } from "@/services/mutations";
import type { VehicleListItem, VehicleZone } from "@/types";
import StatusBadge from "../status-badge";
import { zoneTypeLabel } from "../utils";
import ZoneDeleteConfirmModal from "./zone-delete-confirm-modal";
import ZoneFormModal from "./zone-form-modal";

type Props = {
  vehicle: VehicleListItem | null;
  open: boolean;
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function ZonesModal({ vehicle, open, isSaving, setIsSaving, onClose, onSaved }: Props) {
  const [formZone, setFormZone] = useState<VehicleZone | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VehicleZone | null>(null);
  const zones = vehicle?.zones ?? [];

  async function handleDelete() {
    if (!vehicle || !deleteTarget || isSaving) return;
    setIsSaving(true);
    const result = await deleteVehicleZoneAPI(vehicle.id, deleteTarget.id);
    setIsSaving(false);
    if (result?.ok) {
      toast.success(result.message || "تم حذف المنطقة");
      setDeleteTarget(null);
      await onSaved();
      return;
    }
    toast.error(result?.message || "فشل حذف المنطقة");
  }

  if (!vehicle) return null;

  return (
    <>
      <Modal open={open && !isFormOpen} onClose={onClose} title="مناطق التشغيل" contentClassName="max-w-2xl">
        <div className="space-y-4 p-1">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setFormZone(null);
                setIsFormOpen(true);
              }}
              className="gap-1.5 bg-primary text-secondary hover:bg-primary/90"
            >
              <Plus className="size-4" /> إضافة منطقة
            </Button>
          </div>

          {zones.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray">لا توجد مناطق تشغيل مضافة لهذه المركبة</p>
          ) : (
            <ul className="divide-y divide-primary/10 overflow-hidden rounded-lg border border-primary/10">
              {zones.map((zone) => (
                <li key={zone.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-secondary">{zone.name_ar}</p>
                    <p className="mt-1 text-xs text-gray">
                      {zoneTypeLabel(zone.type)}
                      {zone.type === "slow" && zone.speed_limit != null ? ` - ${zone.speed_limit} كم/س` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={zone.is_active ? "active" : "disabled"} />
                    <button
                      type="button"
                      aria-label="تعديل المنطقة"
                      onClick={() => {
                        setFormZone(zone);
                        setIsFormOpen(true);
                      }}
                      className="grid size-8 place-items-center rounded-lg bg-amber-50 text-orange-500 transition hover:brightness-95"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="حذف المنطقة"
                      onClick={() => setDeleteTarget(zone)}
                      className="grid size-8 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:brightness-95"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      <ZoneFormModal
        key={`zone-form-${formZone?.id ?? "new"}`}
        vehicle={vehicle}
        zone={formZone}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={onSaved}
      />

      <ZoneDeleteConfirmModal
        open={Boolean(deleteTarget)}
        isDeleting={isSaving}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default ZonesModal;

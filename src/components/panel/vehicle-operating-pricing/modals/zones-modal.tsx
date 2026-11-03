"use client";

import { showSuccessModal } from "@/components/ui/success-modal";

import { Info, MapPin, Pencil, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { deleteVehicleZoneAPI } from "@/services/mutations";
import type { VehicleListItem, VehicleZone } from "@/types";
import StatusBadge from "../status-badge";
import PermissionGate from "@/components/permission-gate";
import { vehicleTitle } from "../utils";
import ZoneTypeBadge from "../zone-type-badge";
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
  const activeZones = zones.filter((zone) => zone.is_active);
  const warningZones = activeZones.filter((zone) => zone.type !== "normal");

  async function handleDelete() {
    if (!vehicle || !deleteTarget || isSaving) return;
    setIsSaving(true);
    const result = await deleteVehicleZoneAPI(vehicle.id, deleteTarget.id);
    setIsSaving(false);
    if (result?.ok) {
      showSuccessModal(result.message || "تم حذف المنطقة");
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
          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm leading-6 text-blue-800">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>
              أثناء الرحلة تظهر للسائق مناطق المركبة <strong dir="ltr">{vehicleTitle(vehicle)}</strong> فقط. أضف القيود نفسها إلى كل مركبة يجب أن تطبق عليها؛ مناطق مركبة أخرى أو المناطق العامة لا تطبق على هذه الرحلة.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-dark-gray" aria-label="ملخص مناطق المركبة">
              <span className="rounded-full bg-primary/8 px-3 py-1.5 font-medium">
                {zones.length} منطقة
              </span>
              <span className="rounded-full bg-green-50 px-3 py-1.5 font-medium text-green-700">
                {activeZones.length} نشطة
              </span>
              {warningZones.length > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 font-medium text-orange-700">
                  <ShieldAlert className="size-3.5" aria-hidden="true" />
                  {warningZones.length} تحذيرية
                </span>
              ) : null}
            </div>
            <PermissionGate slug="Admin Add Zones"><Button
              type="button"
              onClick={() => {
                setFormZone(null);
                setIsFormOpen(true);
              }}
              className="gap-1.5 bg-primary text-secondary hover:bg-primary/90"
            >
              <Plus className="size-4 shrink-0" /> إضافة منطقة
            </Button></PermissionGate>
          </div>

          {zones.length === 0 ? (
            <div className="py-8 text-center">
              <MapPinEmptyState />
              <p className="mt-3 text-sm font-medium text-secondary">لا توجد مناطق مرتبطة بهذه المركبة</p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray">
                لن يرى السائق أي حدود أو تحذيرات مناطق أثناء الرحلة بهذه المركبة.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-primary/10 overflow-hidden rounded-lg border border-primary/10">
              {zones.map((zone) => (
                <li key={zone.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-secondary">{zone.name_ar}</p>
                    <div className="mt-2">
                      <ZoneTypeBadge type={zone.type} speedLimit={zone.speed_limit} />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={zone.is_active ? "active" : "disabled"} />
                    <PermissionGate slug="Admin Edit Zones"><button
                      type="button"
                      aria-label="تعديل المنطقة"
                      onClick={() => {
                        setFormZone(zone);
                        setIsFormOpen(true);
                      }}
                      className="grid size-8 place-items-center rounded-lg bg-amber-50 text-orange-500 transition hover:brightness-95"
                    >
                      <Pencil className="size-4 shrink-0" />
                    </button></PermissionGate>
                    <PermissionGate slug="Admin Delete Zones"><button
                      type="button"
                      aria-label="حذف المنطقة"
                      onClick={() => setDeleteTarget(zone)}
                      className="grid size-8 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:brightness-95"
                    >
                      <Trash2 className="size-4 shrink-0" />
                    </button></PermissionGate>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      {isFormOpen && <ZoneFormModal
        key={`zone-form-${formZone?.id ?? "new"}`}
        vehicle={vehicle}
        zone={formZone}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={onSaved}
      />}

      <ZoneDeleteConfirmModal
        open={Boolean(deleteTarget)}
        zone={deleteTarget}
        isDeleting={isSaving}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

function MapPinEmptyState() {
  return (
    <span className="mx-auto grid size-11 place-items-center rounded-full bg-primary/10 text-secondary" aria-hidden="true">
      <MapPin className="size-5" />
    </span>
  );
}

export default ZonesModal;

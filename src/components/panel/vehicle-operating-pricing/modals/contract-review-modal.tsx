"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { reviewVehicleContractAPI } from "@/services/mutations";
import type { VehicleListItem } from "@/types";
import { vehicleTitle } from "../utils";

type Props = {
  vehicle: VehicleListItem | null;
  isSaving: boolean;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  setIsSaving: (value: boolean) => void;
};

type ReviewStatus = "working" | "contract_rejected";

const reviewStatusOptions: Array<{ label: string; value: ReviewStatus }> = [
  { label: "قبول وتشغيل", value: "working" },
  { label: "رفض العقد", value: "contract_rejected" },
];

function ContractReviewModal({
  vehicle,
  isSaving,
  open,
  onClose,
  onSaved,
  setIsSaving,
}: Props) {
  const initialReason = vehicle?.vehicle_contract?.rejection_reason ?? "";
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [reason, setReason] = useState(initialReason);
  const isSubmitDisabled =
    isSaving ||
    !status ||
    (status === "contract_rejected" && !reason.trim());

  async function submit() {
    if (!vehicle || !status || isSubmitDisabled) return;
    if (status === "contract_rejected" && !reason.trim()) {
      toast.error("سبب الرفض مطلوب");
      return;
    }
    setIsSaving(true);
    const result = await reviewVehicleContractAPI(vehicle.id, {
      status,
      rejection_reason:
        status === "contract_rejected" ? reason.trim() : undefined,
    });
    setIsSaving(false);
    if (result?.ok) {
      toast.success(result.message || "تمت مراجعة العقد");
      await onSaved();
      onClose();
      return;
    }
    toast.error(result?.message || "فشلت مراجعة العقد");
  }

  if (!vehicle) return null;
  const attachments = vehicle.vehicle_contract?.attachments ?? [];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`مراجعة عقد ${vehicleTitle(vehicle)}`}
      contentClassName="max-w-xl"
    >
      <div className="space-y-4 p-1">
        <div className="rounded-2xl bg-primary/5 p-3">
          <p className="mb-2 text-sm font-medium text-secondary">المرفقات</p>
          {attachments.length ? (
            attachments.map((attachment, index) => (
              <Attachment key={index} attachment={attachment} index={index} />
            ))
          ) : (
            <p className="text-sm text-gray">لا توجد مرفقات</p>
          )}
        </div>
        <ReviewStatusDropdown value={status} onChange={setStatus} />
        {status === "contract_rejected" && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="اكتب سبب الرفض"
            className="min-h-28 w-full resize-none rounded-2xl border border-primary bg-primary/4 p-3 outline-none"
          />
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={isSubmitDisabled}
            className="min-w-28 bg-primary text-secondary hover:bg-primary/90"
          >
            {isSaving ? <Loader borderColor="#1f2937" /> : "حفظ المراجعة"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ReviewStatusDropdown({
  value,
  onChange,
}: {
  value: ReviewStatus | null;
  onChange: (value: ReviewStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = reviewStatusOptions.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? "اختر القرار";

  return (
    <div className="overflow-hidden rounded-[14px] border border-primary bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between gap-3 bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10"
      >
        <span className="flex min-w-0 items-center gap-2">
          <ListFilter className="size-4 shrink-0 text-primary" />
          <span className={cn("truncate", !selectedOption && "text-gray")}>{selectedLabel}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div className="max-h-32 overflow-y-auto overscroll-contain border-t border-primary/20 bg-bg-warm-ivory [scrollbar-color:rgba(255,213,79,0.9)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-button]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/80">
          {reviewStatusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-11 w-full items-center px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option.value && "bg-primary/15 text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Attachment({
  attachment,
  index,
}: {
  attachment: NonNullable<
    VehicleListItem["vehicle_contract"]
  >["attachments"][number];
  index: number;
}) {
  const url =
    typeof attachment === "string"
      ? attachment
      : (attachment as { url?: string }).url;
  const label =
    typeof attachment === "string"
      ? `مرفق ${index + 1}`
      : (attachment as { name?: string; file_name?: string }).name ||
        (attachment as { file_name?: string }).file_name ||
        `مرفق ${index + 1}`;
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block text-sm font-medium text-secondary underline"
    >
      {label}
    </a>
  ) : (
    <p className="text-sm text-dark-gray">{label}</p>
  );
}

export default ContractReviewModal;

import type {
  FieldErrors,
  FieldNamesMarkedBoolean,
  FieldValues,
  Resolver,
} from "react-hook-form";
import type { z } from "zod";

import {
  mobilityReceiptReviewSchema,
  uploadContractTemplateSchema,
  type MobilityReceiptReviewValues,
  type UploadContractTemplateValues,
} from "@/schemas/mobility-receipts";
import type { MobilityReceipt } from "@/types";

export const receiptReviewResolver =
  createZodResolver<MobilityReceiptReviewValues>(mobilityReceiptReviewSchema);
export const uploadTemplateResolver =
  createZodResolver<UploadContractTemplateValues>(uploadContractTemplateSchema);

export function receiptTitle(receipt: MobilityReceipt) {
  return receipt.label || `Vehicle ${receipt.id.slice(0, 8)}`;
}

export function formatReceiptDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getReceiptAttachments(receipt?: MobilityReceipt | null) {
  const contractAttachments = receipt?.vehicle_contract?.attachments ?? [];
  if (contractAttachments.length) return contractAttachments;
  return receipt?.contract_template ?? [];
}

export function formatMoney(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return `${value} ر.س`;
}

export function formatOperatingType(value?: string) {
  if (value === "evshare") return "EvShare";
  if (value === "operation_company") return "شركة تشغيل";
  return value || "-";
}

export function formatLocation(receipt: MobilityReceipt) {
  return receipt.location?.label || receipt.location?.address || "-";
}

export function getTemplateStatus(receipt: MobilityReceipt) {
  return receipt.contract_template?.length ? "template_uploaded" : "template_missing";
}

export function reviewDefaults(receipt?: MobilityReceipt | null) {
  return {
    status: null,
    rejection_reason: receipt?.vehicle_contract?.rejection_reason ?? "",
  } satisfies MobilityReceiptReviewValues;
}

export function buildReviewPayload(
  values: MobilityReceiptReviewValues,
  dirtyFields: FieldNamesMarkedBoolean<MobilityReceiptReviewValues>,
) {
  if (!values.status) return null;
  if (!dirtyFields.status && !dirtyFields.rejection_reason) return null;
  const payload: MobilityReceiptReviewValues = { status: values.status };
  if (values.status === "rejected") {
    payload.rejection_reason = values.rejection_reason?.trim();
  }
  return payload;
}

export function buildTemplateFormData(
  values: UploadContractTemplateValues,
  dirtyFields: FieldNamesMarkedBoolean<UploadContractTemplateValues>,
) {
  if (!dirtyFields.contract_template) return null;
  const file = values.contract_template?.item(0);
  if (!file) return null;
  const formData = new FormData();
  formData.append("contract_template", file);
  return formData;
}

function createZodResolver<T extends FieldValues>(
  schema: z.ZodType<T>,
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) return { values: result.data, errors: {} };
    const errors: FieldErrors<T> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof T;
      if (!errors[field]) {
        errors[field] = {
          type: issue.code,
          message: issue.message,
        } as FieldErrors<T>[keyof T];
      }
    }
    return { values: {}, errors };
  };
}

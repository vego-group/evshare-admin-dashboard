import { z } from "zod";

export const CONTRACT_TEMPLATE_MAX_SIZE_MB = 5;
export const CONTRACT_TEMPLATE_MAX_SIZE =
  CONTRACT_TEMPLATE_MAX_SIZE_MB * 1024 * 1024;

export const uploadContractTemplateSchema = z.object({
  contract_template: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length <= 1, "اختر ملفا واحدا فقط")
    .refine(
      (files) => !files?.length || files[0].size <= CONTRACT_TEMPLATE_MAX_SIZE,
      `حجم الملف يجب ألا يتجاوز ${CONTRACT_TEMPLATE_MAX_SIZE_MB} ميجابايت`,
    ),
});

export const mobilityReceiptReviewSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    rejection_reason: z.string().trim().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.status === "rejected" && !values.rejection_reason) {
      ctx.addIssue({
        code: "custom",
        path: ["rejection_reason"],
        message: "سبب الرفض مطلوب",
      });
    }
  });

export type UploadContractTemplateValues = z.infer<
  typeof uploadContractTemplateSchema
>;

export type MobilityReceiptReviewValues = z.infer<
  typeof mobilityReceiptReviewSchema
>;

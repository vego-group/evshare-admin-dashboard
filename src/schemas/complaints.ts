import { z } from "zod";

export const answerComplaintSchema = z.object({
  admin_response: z
    .string()
    .trim()
    .min(1, "الرد مطلوب")
    .min(10, "يجب أن يكون الرد 10 أحرف على الأقل"),
});

export type AnswerComplaintFormValues = z.infer<typeof answerComplaintSchema>;

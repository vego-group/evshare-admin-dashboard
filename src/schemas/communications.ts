import { z } from "zod";

export const communicationSchema = z
  .object({
    title: z.string().trim().max(100, "العنوان لا يمكن أن يتجاوز 100 حرف"),
    notification_body: z.string().trim().max(1000, "نص الإشعار لا يمكن أن يتجاوز 1000 حرف"),
    sms_body: z.string().trim().max(1000, "نص الرسالة لا يمكن أن يتجاوز 1000 حرف"),
    channels: z.array(z.enum(["push", "sms"])).min(1, "اختر قناة إرسال واحدة على الأقل"),
    targets: z.array(z.object({
      application: z.enum(["merchant", "rider"]),
      selection_type: z.enum(["all", "specific"]),
      user_ids: z.array(z.string()).max(1000, "لا يمكن اختيار أكثر من 1000 مستخدم"),
    })).min(1, "اختر تطبيقًا مستهدفًا واحدًا على الأقل"),
  })
  .superRefine((values, context) => {
    if (values.channels.includes("push") && !values.title) {
      context.addIssue({ code: "custom", path: ["title"], message: "عنوان الإشعار مطلوب" });
    }
    if (values.channels.includes("push") && !values.notification_body) {
      context.addIssue({ code: "custom", path: ["notification_body"], message: "نص الإشعار مطلوب" });
    }
    if (values.channels.includes("sms") && !values.sms_body) {
      context.addIssue({ code: "custom", path: ["sms_body"], message: "نص الرسالة النصية مطلوب" });
    }
    values.targets.forEach((target, index) => {
      if (target.selection_type === "specific" && target.user_ids.length === 0) {
        context.addIssue({ code: "custom", path: ["targets", index, "user_ids"], message: "اختر مستخدمًا واحدًا على الأقل" });
      }
    });
  });

export type CommunicationFormValues = z.infer<typeof communicationSchema>;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, MessageSquareText, Send, Smartphone, Store, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { communicationSchema, type CommunicationFormValues } from "@/schemas";
import { sendCommunication } from "@/services/mutations";
import type { CommunicationChannel, CommunicationPayload, CommunicationTargetApp } from "@/types";

const defaults: CommunicationFormValues = {
  title: "",
  notification_body: "",
  sms_body: "",
  channels: ["push"],
  target_apps: ["merchant", "rider"],
};

type SendCommunicationModalProps = {
  open: boolean;
  onClose: () => void;
  onSent: (id: string) => Promise<void> | void;
};

export default function SendCommunicationModal({ open, onClose, onSent }: SendCommunicationModalProps) {
  const [attempt, setAttempt] = useState<{ signature: string; key: string } | null>(null);
  const form = useForm<CommunicationFormValues>({
    resolver: zodResolver(communicationSchema),
    defaultValues: defaults,
    mode: "onChange",
  });
  const channels = useWatch({ control: form.control, name: "channels" }) ?? [];
  const targets = useWatch({ control: form.control, name: "target_apps" }) ?? [];
  const title = useWatch({ control: form.control, name: "title" }) ?? "";
  const notificationBody = useWatch({ control: form.control, name: "notification_body" }) ?? "";
  const smsBody = useWatch({ control: form.control, name: "sms_body" }) ?? "";

  useEffect(() => {
    if (!open) {
      form.reset(defaults);
    }
  }, [form, open]);

  const toggle = <T extends string>(field: "channels" | "target_apps", value: T) => {
    const current = form.getValues(field) as T[];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    form.setValue(field, next as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const close = () => {
    if (form.formState.isSubmitting) return;
    setAttempt(null);
    onClose();
  };

  const onSubmit = async (values: CommunicationFormValues) => {
    form.clearErrors("root");
    const payload: CommunicationPayload = {
      channels: values.channels,
      target_apps: values.target_apps,
      ...(values.channels.includes("push")
        ? { title: values.title.trim(), notification_body: values.notification_body.trim() }
        : {}),
      ...(values.channels.includes("sms") ? { sms_body: values.sms_body.trim() } : {}),
    };
    const signature = JSON.stringify(payload);
    const idempotencyKey = attempt?.signature === signature ? attempt.key : crypto.randomUUID();
    if (attempt?.signature !== signature) setAttempt({ signature, key: idempotencyKey });

    const result = await sendCommunication(payload, idempotencyKey);
    if (!result.ok || !result.data?.data) {
      const message = result.message || "تعذر إرسال الرسالة. حاول مرة أخرى.";
      form.setError("root", { type: "server", message });
      toast.error(message);
      return;
    }

    toast.success(result.data.replayed ? "هذه الرسالة موجودة بالفعل ولم تُرسل مرتين" : "تمت إضافة الرسالة إلى قائمة الإرسال");
    const id = result.data.data.id;
    form.reset(defaults);
    setAttempt(null);
    onClose();
    await onSent(id);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="إرسال رسالة تسويقية"
      description="اختر التطبيقات والقنوات، وسيحدد النظام المستلمين المؤهلين عند بدء الإرسال."
      contentClassName="md:max-w-[760px]"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1 md:p-4">
        <ChoiceGroup label="التطبيقات المستهدفة" error={form.formState.errors.target_apps?.message}>
          <ChoiceCard selected={targets.includes("merchant")} icon={Store} label="تطبيق التاجر" onClick={() => toggle<CommunicationTargetApp>("target_apps", "merchant")} />
          <ChoiceCard selected={targets.includes("rider")} icon={Truck} label="تطبيق السائق" onClick={() => toggle<CommunicationTargetApp>("target_apps", "rider")} />
        </ChoiceGroup>

        <ChoiceGroup label="قنوات الإرسال" error={form.formState.errors.channels?.message}>
          <ChoiceCard selected={channels.includes("push")} icon={BellRing} label="إشعار فوري" onClick={() => toggle<CommunicationChannel>("channels", "push")} />
          <ChoiceCard selected={channels.includes("sms")} icon={MessageSquareText} label="رسالة SMS" onClick={() => toggle<CommunicationChannel>("channels", "sms")} />
        </ChoiceGroup>

        {channels.includes("push") ? (
          <section className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-secondary"><Smartphone className="size-5 text-blue-600" />محتوى الإشعار الفوري</h3>
            <FormField label="العنوان" error={form.formState.errors.title?.message} count={`${title.length}/100`}>
              <input {...form.register("title")} maxLength={100} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="مثال: عرض جديد" />
            </FormField>
            <FormField label="نص الإشعار" error={form.formState.errors.notification_body?.message} count={`${notificationBody.length}/1000`}>
              <textarea {...form.register("notification_body")} maxLength={1000} rows={4} className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="اكتب نص الإشعار الذي سيظهر في التطبيق" />
            </FormField>
          </section>
        ) : null}

        {channels.includes("sms") ? (
          <section className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-secondary"><MessageSquareText className="size-5 text-emerald-600" />محتوى الرسالة النصية</h3>
            <FormField label="نص SMS" error={form.formState.errors.sms_body?.message} count={`${smsBody.length}/1000`}>
              <textarea {...form.register("sms_body")} maxLength={1000} rows={4} className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="اكتب نص الرسالة النصية المستقل" />
            </FormField>
          </section>
        ) : null}

        <InputErrorMessage msg={form.formState.errors.root?.message} />

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={form.formState.isSubmitting} className="sm:min-w-28">إلغاء</Button>
          <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className="sm:min-w-40">
            {form.formState.isSubmitting ? <Loader /> : <Send className="size-4" />}
            إرسال الآن
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ChoiceGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <fieldset><legend className="mb-3 text-sm font-semibold text-secondary">{label}</legend><div className="grid gap-3 sm:grid-cols-2">{children}</div><InputErrorMessage msg={error} /></fieldset>;
}

function ChoiceCard({ selected, icon: Icon, label, onClick }: { selected: boolean; icon: typeof Store; label: string; onClick: () => void }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`flex items-center gap-3 rounded-xl border p-4 text-right transition ${selected ? "border-primary bg-primary/10 text-secondary ring-1 ring-primary" : "border-neutral-200 bg-white text-dark-gray hover:border-primary/60"}`}><span className={`grid size-9 place-items-center rounded-lg ${selected ? "bg-primary text-secondary" : "bg-neutral-100"}`}><Icon className="size-5" /></span><span className="font-medium">{label}</span></button>;
}

function FormField({ label, error, count, children }: { label: string; error?: string; count: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="flex justify-between text-sm font-medium text-secondary"><span>{label}</span><span dir="ltr" className="text-xs font-normal text-gray">{count}</span></span>{children}<InputErrorMessage msg={error} /></label>;
}

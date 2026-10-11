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

import RecipientPicker from "./recipient-picker";

const defaults: CommunicationFormValues = {
  title: "", notification_body: "", sms_body: "", channels: ["push"],
  targets: [
    { application: "merchant", selection_type: "all", user_ids: [] },
    { application: "rider", selection_type: "all", user_ids: [] },
  ],
};

type Props = { open: boolean; canSelectRecipients: boolean; onClose: () => void; onSent: (id: string) => Promise<void> | void };

export default function SendCommunicationModal({ open, canSelectRecipients, onClose, onSent }: Props) {
  const [attempt, setAttempt] = useState<{ signature: string; key: string } | null>(null);
  const form = useForm<CommunicationFormValues>({ resolver: zodResolver(communicationSchema), defaultValues: defaults, mode: "onChange" });
  const channels = useWatch({ control: form.control, name: "channels" }) ?? [];
  const targets = useWatch({ control: form.control, name: "targets" }) ?? [];
  const title = useWatch({ control: form.control, name: "title" }) ?? "";
  const notificationBody = useWatch({ control: form.control, name: "notification_body" }) ?? "";
  const smsBody = useWatch({ control: form.control, name: "sms_body" }) ?? "";

  useEffect(() => { if (!open) form.reset(defaults); }, [form, open]);

  const toggleChannel = (value: CommunicationChannel) => {
    const next = channels.includes(value) ? channels.filter((item) => item !== value) : [...channels, value];
    form.setValue("channels", next, { shouldDirty: true, shouldValidate: true });
  };
  const toggleApplication = (application: CommunicationTargetApp) => {
    const existing = targets.some((target) => target.application === application);
    const next = existing ? targets.filter((target) => target.application !== application) : [...targets, { application, selection_type: "all" as const, user_ids: [] }];
    form.setValue("targets", next, { shouldDirty: true, shouldValidate: true });
  };
  const updateTarget = (application: CommunicationTargetApp, patch: Partial<CommunicationFormValues["targets"][number]>) => {
    form.setValue("targets", targets.map((target) => target.application === application ? { ...target, ...patch } : target), { shouldDirty: true, shouldValidate: true });
  };
  const close = () => { if (!form.formState.isSubmitting) { setAttempt(null); onClose(); } };

  const onSubmit = async (values: CommunicationFormValues) => {
    form.clearErrors("root");
    const payload: CommunicationPayload = {
      channels: values.channels,
      targets: values.targets.map((target) => ({ application: target.application, selection_type: target.selection_type, user_ids: target.selection_type === "specific" ? [...new Set(target.user_ids)] : [] })),
      ...(values.channels.includes("push") ? { title: values.title.trim(), notification_body: values.notification_body.trim() } : {}),
      ...(values.channels.includes("sms") ? { sms_body: values.sms_body.trim() } : {}),
    };
    const signature = JSON.stringify(payload);
    const idempotencyKey = attempt?.signature === signature ? attempt.key : crypto.randomUUID();
    if (attempt?.signature !== signature) setAttempt({ signature, key: idempotencyKey });
    const result = await sendCommunication(payload, idempotencyKey);
    if (!result.ok || !result.data?.data) {
      const message = result.message || "تعذر إرسال الرسالة. حاول مرة أخرى.";
      form.setError("root", { type: "server", message }); toast.error(message); return;
    }
    toast.success(result.data.replayed ? "هذه الرسالة موجودة بالفعل ولم تُرسل مرتين" : "تمت إضافة الرسالة إلى قائمة الإرسال");
    const id = result.data.data.id;
    form.reset(defaults); setAttempt(null); onClose(); await onSent(id);
  };

  return (
    <Modal open={open} onClose={close} title="إرسال رسالة تسويقية" description="اختر الجمهور لكل تطبيق وقنوات الإرسال، ثم راجع المحتوى قبل الإرسال." contentClassName="md:max-w-[820px]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1 md:p-4">
        <ChoiceGroup label="التطبيقات المستهدفة" error={form.formState.errors.targets?.root?.message ?? form.formState.errors.targets?.message}>
          <ChoiceCard selected={targets.some((target) => target.application === "merchant")} icon={Store} label="تطبيق التاجر" onClick={() => toggleApplication("merchant")} />
          <ChoiceCard selected={targets.some((target) => target.application === "rider")} icon={Truck} label="تطبيق السائق" onClick={() => toggleApplication("rider")} />
        </ChoiceGroup>

        {targets.length ? <section className="space-y-4 rounded-2xl border border-neutral-100 bg-background/70 p-4">
          <div><h3 className="text-sm font-semibold text-secondary">المستلمون</h3><p className="mt-1 text-xs text-gray">حدد الجمهور لكل تطبيق بشكل مستقل.</p></div>
          {targets.map((target, index) => <div key={target.application} className="space-y-3 rounded-xl border border-neutral-200 bg-white/70 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-secondary">{target.application === "merchant" ? "تطبيق التاجر" : "تطبيق السائق"}</span>
              <div className="inline-flex w-fit rounded-xl bg-neutral-100 p-1 text-sm">
                <SelectionButton active={target.selection_type === "all"} onClick={() => updateTarget(target.application, { selection_type: "all", user_ids: [] })}>كل المستخدمين</SelectionButton>
                {canSelectRecipients ? <SelectionButton active={target.selection_type === "specific"} onClick={() => updateTarget(target.application, { selection_type: "specific" })}>مستخدمون محددون</SelectionButton> : null}
              </div>
            </div>
            {target.selection_type === "specific" ? <><RecipientPicker application={target.application} channels={channels} selectedIds={target.user_ids} onChange={(user_ids) => updateTarget(target.application, { user_ids })} /><InputErrorMessage msg={form.formState.errors.targets?.[index]?.user_ids?.message} /></> : <p className="text-xs text-gray">سيتم تحديد كل المستخدمين المؤهلين عند بدء الإرسال.</p>}
          </div>)}
          {!canSelectRecipients ? <p className="text-xs text-amber-700">لا تملك صلاحية عرض بيانات المستلمين؛ يمكنك الإرسال إلى كل المستخدمين فقط.</p> : null}
        </section> : null}

        <ChoiceGroup label="قنوات الإرسال" error={form.formState.errors.channels?.message}>
          <ChoiceCard selected={channels.includes("push")} icon={BellRing} label="إشعار فوري" onClick={() => toggleChannel("push")} />
          <ChoiceCard selected={channels.includes("sms")} icon={MessageSquareText} label="رسالة SMS" onClick={() => toggleChannel("sms")} />
        </ChoiceGroup>

        {channels.includes("push") ? <section className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-secondary"><Smartphone className="size-5 text-blue-600" />محتوى الإشعار الفوري</h3>
          <FormField label="العنوان" error={form.formState.errors.title?.message} count={`${title.length}/100`}><input {...form.register("title")} maxLength={100} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="مثال: عرض جديد" /></FormField>
          <FormField label="نص الإشعار" error={form.formState.errors.notification_body?.message} count={`${notificationBody.length}/1000`}><textarea {...form.register("notification_body")} maxLength={1000} rows={4} className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="اكتب نص الإشعار الذي سيظهر في التطبيق" /></FormField>
        </section> : null}

        {channels.includes("sms") ? <section className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-secondary"><MessageSquareText className="size-5 text-emerald-600" />محتوى الرسالة النصية</h3>
          <FormField label="نص SMS" error={form.formState.errors.sms_body?.message} count={`${smsBody.length}/1000`}><textarea {...form.register("sms_body")} maxLength={1000} rows={4} className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="اكتب نص الرسالة النصية المستقل" /></FormField>
        </section> : null}

        <InputErrorMessage msg={form.formState.errors.root?.message} />
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row"><Button type="button" variant="outline" onClick={close} disabled={form.formState.isSubmitting} className="sm:min-w-28">إلغاء</Button><Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className="sm:min-w-40">{form.formState.isSubmitting ? <Loader /> : <Send className="size-4" />}إرسال الآن</Button></div>
      </form>
    </Modal>
  );
}

function ChoiceGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <fieldset><legend className="mb-3 text-sm font-semibold text-secondary">{label}</legend><div className="grid gap-3 sm:grid-cols-2">{children}</div><InputErrorMessage msg={error} /></fieldset>; }
function ChoiceCard({ selected, icon: Icon, label, onClick }: { selected: boolean; icon: typeof Store; label: string; onClick: () => void }) { return <button type="button" aria-pressed={selected} onClick={onClick} className={`flex items-center gap-3 rounded-xl border p-4 text-right transition ${selected ? "border-primary bg-primary/10 text-secondary ring-1 ring-primary" : "border-neutral-200 bg-white text-dark-gray hover:border-primary/60"}`}><span className={`grid size-9 place-items-center rounded-lg ${selected ? "bg-primary text-secondary" : "bg-neutral-100"}`}><Icon className="size-5" /></span><span className="font-medium">{label}</span></button>; }
function SelectionButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-lg px-3 py-1.5 transition ${active ? "bg-white font-medium text-secondary shadow-sm" : "text-gray hover:text-secondary"}`}>{children}</button>; }
function FormField({ label, error, count, children }: { label: string; error?: string; count: string; children: React.ReactNode }) { return <label className="block space-y-2"><span className="flex justify-between text-sm font-medium text-secondary"><span>{label}</span><span dir="ltr" className="text-xs font-normal text-gray">{count}</span></span>{children}<InputErrorMessage msg={error} /></label>; }

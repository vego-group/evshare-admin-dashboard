"use client";

import { BellRing, MessageSquareText, UsersRound } from "lucide-react";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { useCommunication } from "@/hooks/api";
import type { CommunicationChannelDelivery } from "@/types";

import { CommunicationStatusBadge, formatCommunicationDate } from "./utils";

export default function CommunicationDetailsPanel({ id, open, onClose }: { id: string | null; open: boolean; onClose: () => void }) {
  const { data, isLoading, isError } = useCommunication(id);
  const item = data?.data;
  if (!id) return null;

  return (
    <Panel open={open} onClose={onClose} title="تفاصيل الرسالة" contentClassName="w-full gap-0 overflow-hidden bg-white p-0 sm:max-w-xl sm:rounded-l-3xl" headerClassName="relative shrink-0 border-b border-neutral-100 px-6 py-6 text-right" titleClassName="text-2xl font-semibold text-secondary">
      <div className="h-full overflow-y-auto p-6 text-right">
        {isLoading ? <DetailsShimmer /> : isError || !item ? <p className="rounded-xl bg-rose-50 p-4 text-rose-700">تعذر تحميل تفاصيل الرسالة.</p> : (
          <div className="space-y-5">
            <section className="space-y-3 rounded-2xl bg-background p-5">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-gray">العنوان</p><h2 className="mt-1 text-lg font-semibold text-secondary">{item.title || "رسالة نصية بدون عنوان"}</h2></div><CommunicationStatusBadge status={item.status} /></div>
              <Detail label="أنشأها" value={item.created_by?.name || "—"} />
              <Detail label="تاريخ الإنشاء" value={formatCommunicationDate(item.created_at)} ltr />
              <Detail label="بدء الإرسال" value={formatCommunicationDate(item.started_at)} ltr />
              <Detail label="اكتمال الإرسال" value={formatCommunicationDate(item.sent_at)} ltr />
            </section>

            {item.notification_body ? <ContentBlock title="الإشعار الفوري" icon={BellRing} text={item.notification_body} /> : null}
            {item.sms_body ? <ContentBlock title="الرسالة النصية" icon={MessageSquareText} text={item.sms_body} /> : null}

            {item.delivery.audience ? (
              <section className="rounded-2xl border border-neutral-100 p-5"><h3 className="mb-4 flex items-center gap-2 font-semibold text-secondary"><UsersRound className="size-5 text-primary" />الجمهور المستهدف</h3><div className="grid grid-cols-3 gap-2"><Metric label="الإجمالي" value={item.delivery.audience.total_users} /><Metric label="التجار" value={item.delivery.audience.merchant_users} /><Metric label="السائقون" value={item.delivery.audience.rider_users} /></div></section>
            ) : <p className="rounded-2xl border border-dashed border-neutral-200 p-5 text-center text-sm text-gray">سيظهر حجم الجمهور وإحصاءات التسليم عند بدء المعالجة.</p>}

            {item.delivery.push ? <DeliveryBlock title="تسليم الإشعارات" delivery={item.delivery.push} /> : null}
            {item.delivery.sms ? <DeliveryBlock title="تسليم الرسائل النصية" delivery={item.delivery.sms} /> : null}
          </div>
        )}
      </div>
    </Panel>
  );
}

function Detail({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) { return <div className="flex justify-between gap-4 border-t border-neutral-200/70 pt-3 text-sm"><span className="text-gray">{label}</span><span dir={ltr ? "ltr" : undefined} className="font-medium text-secondary">{value}</span></div>; }
function ContentBlock({ title, icon: Icon, text }: { title: string; icon: typeof BellRing; text: string }) { return <section className="rounded-2xl border border-neutral-100 p-5"><h3 className="mb-3 flex items-center gap-2 font-semibold text-secondary"><Icon className="size-5 text-primary" />{title}</h3><p className="whitespace-pre-wrap text-sm leading-7 text-dark-gray">{text}</p></section>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-background p-3 text-center"><strong dir="ltr" className="block text-xl text-secondary">{value.toLocaleString("en-US")}</strong><span className="text-xs text-gray">{label}</span></div>; }
function DeliveryBlock({ title, delivery }: { title: string; delivery: CommunicationChannelDelivery }) { return <section className="rounded-2xl border border-neutral-100 p-5"><h3 className="mb-4 font-semibold text-secondary">{title}</h3><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Metric label="قابلون للوصول" value={delivery.targeted} /><Metric label="تم الإرسال" value={delivery.sent} /><Metric label="فشل" value={delivery.failed} /><Metric label="تم التجاوز" value={delivery.skipped} /></div></section>; }
function DetailsShimmer() { return <div className="space-y-4">{[180,110,150,130].map((width, index) => <Shimmer key={index} className="h-24 rounded-2xl" style={{ width: `${width}px`, maxWidth: "100%" }} />)}</div>; }

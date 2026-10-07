"use client";

import { useEffect, useState } from "react";
import { Pencil, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Header from "@/components/ui/header";
import Modal from "@/components/ui/modal";
import Shimmer from "@/components/ui/shimmer";
import { ADMIN_PERMISSIONS, PAGE_SIZE } from "@/constants";
import { usePaymentGateway, usePaymentGateways } from "@/hooks/api";
import { editPaymentGateway } from "@/services/mutations";
import type { PaymentGateway, PaymentGatewayUserType, UpdatePaymentGatewayPayload } from "@/types";
import PaymentMethodsPagination from "@/components/panel/payment-methods/pagination";
import FilterSelect, { type FilterOption } from "@/components/panel/payment-methods/toolbar/filter-select";

type StatusFilter = "all" | "active" | "inactive";
const statusOptions: FilterOption<StatusFilter>[] = [
  { label: "كل الحالات", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

export default function PaymentGateways() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState<string>();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pendingEdit, setPendingEdit] = useState<PaymentGateway | null>(null);
  const { data, isLoading } = usePaymentGateways({
    page,
    per_page: PAGE_SIZE,
    search,
    is_active: status === "all" ? undefined : status === "active",
  });
  const { data: details, isLoading: isDetailsLoading } = usePaymentGateway(pendingEdit?.id ?? null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchValue.trim() || undefined);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  const refresh = async (id: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] }),
      queryClient.invalidateQueries({ queryKey: ["payment-gateway", id] }),
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] }),
    ]);
  };

  if (isLoading) return <GatewayShimmer />;

  return <div className="flex w-full flex-col gap-6">
    <Header title="بوابات الدفع" subtitle="إدارة تكاملات الدفع، العملات، صلاحيات الاستخدام ومفاتيح الاتصال لكل دولة" />
    <section className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0">
      <label className="relative block flex-1"><Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray" /><input type="search" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="ابحث باسم البوابة أو المفتاح..." className="h-12 w-full rounded-[14px] px-12 text-right outline-none" /></label>
      <FilterSelect label="الحالة" options={statusOptions} value={status} onChange={(value) => { setStatus(value); setPage(1); }} />
    </section>
    <GatewayTable gateways={data?.data ?? []} onEdit={setPendingEdit} />
    <PaymentMethodsPagination meta={data?.meta} onPageChange={setPage} />
    {pendingEdit ? <GatewayEditModal key={details?.data ? `loaded-${pendingEdit.id}` : `loading-${pendingEdit.id}`} open gateway={details?.data} isLoading={isDetailsLoading} onClose={() => setPendingEdit(null)} onSaved={refresh} /> : null}
  </div>;
}

function GatewayTable({ gateways, onEdit }: { gateways: PaymentGateway[]; onEdit: (gateway: PaymentGateway) => void }) {
  if (!gateways.length) return <EmptyState title="لا توجد بوابات دفع" description="لم يتم العثور على بوابات دفع مطابقة." className="min-h-90 rounded-2xl bg-white" />;
  return <div className="overflow-x-auto rounded-2xl bg-white"><table className="w-full min-w-250 text-right">
    <thead className="bg-primary/8 text-dark-gray"><tr><th className="px-5 py-4">البوابة</th><th className="px-5 py-4">المفتاح</th><th className="px-5 py-4">العملات</th><th className="px-5 py-4">المستخدمون</th><th className="px-5 py-4">طرق الدفع</th><th className="px-5 py-4">الحالة</th><th className="px-5 py-4">الإجراءات</th></tr></thead>
    <tbody>{gateways.map((gateway) => <tr key={gateway.id} className="border-b border-primary/15 last:border-0">
      <td className="px-5 py-4"><span className="font-medium">{gateway.name}</span>{gateway.is_default && <span className="me-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-secondary">افتراضية</span>}</td>
      <td dir="ltr" className="px-5 py-4 text-right font-mono text-xs">{gateway.key}</td>
      <td className="px-5 py-4">{gateway.supported_currencies?.join("، ") || "-"}</td>
      <td className="px-5 py-4">{formatUserTypes(gateway.allowed_user_types)}</td>
      <td className="px-5 py-4 tabular-nums">{gateway.payment_methods_count}</td>
      <td className="px-5 py-4"><StatusBadge active={gateway.is_active} /></td>
      <td className="px-5 py-4"><PermissionGate slug={[ADMIN_PERMISSIONS.paymentGateways.show, ADMIN_PERMISSIONS.paymentGateways.edit]} requireAll><Button size="icon-sm" variant="ghost" aria-label="تعديل" onClick={() => onEdit(gateway)}><Pencil /></Button></PermissionGate></td>
    </tr>)}</tbody>
  </table></div>;
}

type GatewayDraft = { is_active: boolean; is_default: boolean; supported_currencies: string; allowed_user_types: PaymentGatewayUserType[]; config: string };
const emptyDraft: GatewayDraft = { is_active: false, is_default: false, supported_currencies: "", allowed_user_types: [], config: "" };

function GatewayEditModal({ open, gateway, isLoading, onClose, onSaved }: { open: boolean; gateway?: PaymentGateway; isLoading: boolean; onClose: () => void; onSaved: (id: string) => Promise<void> }) {
  const [draft, setDraft] = useState<GatewayDraft>(() => gateway ? toGatewayDraft(gateway) : emptyDraft);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [dirtyCredentials, setDirtyCredentials] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setCredential = (key: string, value: string) => {
    setCredentials((current) => ({ ...current, [key]: value }));
    setDirtyCredentials((current) => current.includes(key) ? current : [...current, key]);
  };
  const toggleUserType = (type: PaymentGatewayUserType) => setDraft((current) => ({ ...current, allowed_user_types: current.allowed_user_types.includes(type) ? current.allowed_user_types.filter((item) => item !== type) : [...current.allowed_user_types, type] }));

  const submit = async () => {
    if (!gateway) return;
    let config: Record<string, unknown> = {};
    try { config = draft.config.trim() ? JSON.parse(draft.config) : {}; } catch { toast.error("إعدادات Config يجب أن تكون JSON صالحًا"); return; }
    const payload: UpdatePaymentGatewayPayload = {
      is_active: draft.is_active,
      is_default: draft.is_default,
      supported_currencies: draft.supported_currencies.split(",").map((value) => value.trim().toUpperCase()).filter(Boolean),
      allowed_user_types: draft.allowed_user_types,
      config,
    };
    if (dirtyCredentials.length) payload.credentials = Object.fromEntries(dirtyCredentials.map((key) => [key, credentials[key] ?? ""]));
    setIsSubmitting(true);
    const result = await editPaymentGateway(gateway.id, payload);
    setIsSubmitting(false);
    if (!result?.ok) { toast.error(result?.message || "فشل تعديل بوابة الدفع"); return; }
    toast.success(result.message || "تم تعديل بوابة الدفع بنجاح");
    onClose();
    await onSaved(gateway.id);
  };

  return <Modal open={open} onClose={onClose} title={`تعديل بوابة الدفع${gateway ? `: ${gateway.name}` : ""}`} description="اترك حقول المفاتيح دون تغيير للاحتفاظ بالقيم الحالية. القيمة الفارغة تحذف المفتاح بعد تعديل الحقل." contentClassName="md:max-w-[760px]">
    {isLoading || !gateway ? <div className="space-y-4 p-4">{Array.from({ length: 6 }).map((_, index) => <Shimmer key={index} className="h-12 w-full rounded-xl" />)}</div> : <div className="grid gap-4 p-4 sm:grid-cols-2">
      <Toggle label="البوابة نشطة" checked={draft.is_active} onChange={(value) => setDraft((current) => ({ ...current, is_active: value }))} />
      <Toggle label="البوابة الافتراضية" checked={draft.is_default} onChange={(value) => setDraft((current) => ({ ...current, is_default: value }))} />
      <label className="text-sm font-medium sm:col-span-2">العملات المدعومة (مفصولة بفاصلة)<input dir="ltr" value={draft.supported_currencies} onChange={(event) => setDraft((current) => ({ ...current, supported_currencies: event.target.value }))} className={inputClass} placeholder="SAR, JOD" /></label>
      <fieldset className="rounded-xl border border-primary/15 p-4 sm:col-span-2"><legend className="px-1 text-sm font-medium">أنواع المستخدمين</legend><div className="flex gap-4">{([['merchant', 'التجار'], ['driver', 'السائقون']] as const).map(([value, label]) => <label key={value} className="flex items-center gap-2"><input type="checkbox" checked={draft.allowed_user_types.includes(value)} onChange={() => toggleUserType(value)} className="size-5 accent-primary" />{label}</label>)}</div></fieldset>
      {([['secret_key', 'Secret key'], ['webhook_secret', 'Webhook secret']] as const).map(([key, label]) => <label key={key} className="text-sm font-medium">{label}<input dir="ltr" type="password" autoComplete="new-password" value={credentials[key] ?? ""} onChange={(event) => setCredential(key, event.target.value)} className={inputClass} placeholder={gateway.credentials?.[key] || "اتركه دون تغيير"} /></label>)}
      <label className="text-sm font-medium sm:col-span-2">Config (JSON)<textarea dir="ltr" rows={5} value={draft.config} onChange={(event) => setDraft((current) => ({ ...current, config: event.target.value }))} className={`${inputClass} h-auto py-3 font-mono text-xs`} /></label>
      <div className="flex justify-end gap-3 sm:col-span-2"><Button variant="outline" onClick={onClose} disabled={isSubmitting}>إلغاء</Button><Button onClick={submit} disabled={isSubmitting}>{isSubmitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}</Button></div>
    </div>}
  </Modal>;
}

const inputClass = "mt-2 h-11 w-full rounded-xl border border-primary/20 px-3 text-left text-sm outline-none focus:border-primary";
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center justify-between rounded-xl border border-primary/15 p-4 text-sm font-medium">{label}<input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 accent-primary" /></label>; }
function StatusBadge({ active }: { active: boolean }) { return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{active ? "نشطة" : "متوقفة"}</span>; }
function formatUserTypes(types: PaymentGatewayUserType[] = []) { return types.map((type) => type === "merchant" ? "التجار" : "السائقون").join("، ") || "-"; }
function toGatewayDraft(gateway: PaymentGateway): GatewayDraft { return { is_active: gateway.is_active, is_default: gateway.is_default, supported_currencies: gateway.supported_currencies.join(", "), allowed_user_types: gateway.allowed_user_types ?? [], config: gateway.config ? JSON.stringify(gateway.config, null, 2) : "" }; }
function GatewayShimmer() { return <div className="space-y-6"><Shimmer className="h-16 w-full rounded-xl" /><Shimmer className="h-14 w-full rounded-2xl" /><Shimmer className="h-96 w-full rounded-2xl" /></div>; }

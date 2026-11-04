"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, KeyRound, LoaderCircle, Pencil, Search, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

import PaymentMethodsPagination from "@/components/panel/payment-methods/pagination";
import FilterSelect, { type FilterOption } from "@/components/panel/payment-methods/toolbar/filter-select";
import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Header from "@/components/ui/header";
import Modal from "@/components/ui/modal";
import QueryErrorState from "@/components/ui/query-error-state";
import Shimmer from "@/components/ui/shimmer";
import { showSuccessModal } from "@/components/ui/success-modal";
import { ADMIN_PERMISSIONS, PAGE_SIZE } from "@/constants";
import { usePaymentGateway, usePaymentGateways } from "@/hooks/api";
import { editPaymentGateway } from "@/services/mutations";
import type { PaymentGateway, PaymentGatewayUserType } from "@/types";
import { buildPaymentGatewayPayload, credentialKeys, toGatewayDraft, type GatewayDraft } from "./utils";

type StatusFilter = "all" | "active" | "inactive";
const statusOptions: FilterOption<StatusFilter>[] = [
  { label: "كل الحالات", value: "all" },
  { label: "نشطة", value: "active" },
  { label: "متوقفة", value: "inactive" },
];

export default function PaymentGateways() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState<string>();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pendingEdit, setPendingEdit] = useState<PaymentGateway | null>(null);
  const gatewaysQuery = usePaymentGateways({ page, per_page: PAGE_SIZE, search, is_active: status === "all" ? undefined : status === "active" });
  const detailsQuery = usePaymentGateway(pendingEdit?.id ?? null);

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

  const resetFilters = () => {
    setSearchValue("");
    setSearch(undefined);
    setStatus("all");
    setPage(1);
  };

  if (gatewaysQuery.isLoading) return <GatewayShimmer />;
  const hasActiveFilters = Boolean(searchValue.trim() || status !== "all");

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="بوابات الدفع" subtitle="إدارة تكاملات الدفع والعملات وصلاحيات الاستخدام ومفاتيح الاتصال لكل دولة" />
      {gatewaysQuery.isError ? (
        <QueryErrorState title="تعذر تحميل بوابات الدفع" isRetrying={gatewaysQuery.isFetching} onRetry={() => void gatewaysQuery.refetch()} />
      ) : (
        <>
          <GatewayToolbar searchValue={searchValue} status={status} hasActiveFilters={hasActiveFilters} onSearchChange={setSearchValue} onStatusChange={(value) => { setStatus(value); setPage(1); }} onReset={resetFilters} />
          <GatewayTable gateways={gatewaysQuery.data?.data ?? []} isFiltered={hasActiveFilters} onEdit={setPendingEdit} />
          <PaymentMethodsPagination meta={gatewaysQuery.data?.meta} onPageChange={setPage} />
        </>
      )}
      {pendingEdit ? (
        <GatewayEditModal
          key={detailsQuery.data?.data ? `loaded-${pendingEdit.id}` : pendingEdit.id}
          open
          gateway={detailsQuery.data?.data}
          isLoading={detailsQuery.isLoading}
          isError={detailsQuery.isError}
          isRetrying={detailsQuery.isFetching}
          onRetry={() => void detailsQuery.refetch()}
          onClose={() => setPendingEdit(null)}
          onSaved={refresh}
        />
      ) : null}
    </div>
  );
}

type ToolbarProps = { searchValue: string; status: StatusFilter; hasActiveFilters: boolean; onSearchChange: (value: string) => void; onStatusChange: (value: StatusFilter) => void; onReset: () => void };

function GatewayToolbar(props: ToolbarProps) {
  return (
    <section aria-label="البحث وتصفية بوابات الدفع" className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0">
      <label className="relative block flex-1 rounded-[14px] bg-white focus-within:ring-2 focus-within:ring-[#8a6500] focus-within:ring-offset-2">
        <span className="sr-only">البحث في بوابات الدفع</span>
        <Search aria-hidden="true" className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray" />
        <input type="search" value={props.searchValue} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="ابحث باسم البوابة أو المفتاح..." className="h-12 w-full rounded-[14px] bg-white px-12 text-right outline-none" />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect label="الحالة" options={statusOptions} value={props.status} onChange={props.onStatusChange} />
        {props.hasActiveFilters ? <Button type="button" variant="ghost" onClick={props.onReset} className="h-9.5 px-3 text-gray hover:text-secondary"><X aria-hidden="true" className="size-4" />مسح الفلاتر</Button> : null}
      </div>
    </section>
  );
}

function GatewayTable({ gateways, isFiltered, onEdit }: { gateways: PaymentGateway[]; isFiltered: boolean; onEdit: (gateway: PaymentGateway) => void }) {
  if (!gateways.length) return <EmptyState title={isFiltered ? "لا توجد نتائج مطابقة" : "لا توجد بوابات دفع"} description={isFiltered ? "جرّب تعديل البحث أو مسح الفلاتر لعرض بوابات أخرى." : "لم تتم إضافة بوابات دفع لهذا البلد بعد."} className="min-h-90 rounded-2xl bg-white" />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <table className="w-full min-w-250 text-right">
        <caption className="sr-only">بوابات الدفع وإعدادات تشغيلها</caption>
        <thead className="bg-primary/8 text-dark-gray"><tr><th scope="col" className="px-5 py-4">البوابة</th><th scope="col" className="px-5 py-4">المفتاح</th><th scope="col" className="px-5 py-4">العملات</th><th scope="col" className="px-5 py-4">المستخدمون</th><th scope="col" className="px-5 py-4">طرق الدفع</th><th scope="col" className="px-5 py-4">الحالة</th><th scope="col" className="px-5 py-4">الإجراءات</th></tr></thead>
        <tbody>{gateways.map((gateway) => (
          <tr key={gateway.id} className="border-b border-primary/15 transition-colors last:border-0 hover:bg-neutral-50/70">
            <td className="px-5 py-4"><div className="flex flex-wrap items-center gap-2"><span className="font-medium text-secondary">{gateway.name}</span>{gateway.is_default ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-[#795900]">الافتراضية</span> : null}</div></td>
            <td dir="ltr" className="px-5 py-4 text-right font-mono text-xs">{gateway.key}</td>
            <td className="px-5 py-4"><CurrencyBadges currencies={gateway.supported_currencies ?? []} /></td>
            <td className="px-5 py-4">{formatUserTypes(gateway.allowed_user_types)}</td>
            <td className="px-5 py-4 tabular-nums">{gateway.payment_methods_count.toLocaleString("en-US")}</td>
            <td className="px-5 py-4"><StatusBadge active={gateway.is_active} /></td>
            <td className="px-5 py-4"><PermissionGate slug={[ADMIN_PERMISSIONS.paymentGateways.show, ADMIN_PERMISSIONS.paymentGateways.edit]} requireAll><Button type="button" size="icon-sm" variant="ghost" aria-label={`تعديل بوابة ${gateway.name}`} onClick={() => onEdit(gateway)}><Pencil aria-hidden="true" /></Button></PermissionGate></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

type GatewayEditModalProps = { open: boolean; gateway?: PaymentGateway; isLoading: boolean; isError: boolean; isRetrying: boolean; onRetry: () => void; onClose: () => void; onSaved: (id: string) => Promise<void> };

function GatewayEditModal({ open, gateway, isLoading, isError, isRetrying, onRetry, onClose, onSaved }: GatewayEditModalProps) {
  const [draft, setDraft] = useState<GatewayDraft>(() => gateway ? toGatewayDraft(gateway) : emptyDraft);
  const [credentialChanges, setCredentialChanges] = useState<Record<string, string>>({});
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [deactivationConfirmed, setDeactivationConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const payloadState = useMemo(() => {
    if (!gateway) return { payload: {}, configError: false };
    try { return { payload: buildPaymentGatewayPayload(gateway, draft, credentialChanges), configError: false }; }
    catch { return { payload: {}, configError: true }; }
  }, [credentialChanges, draft, gateway]);
  const isDeactivating = Boolean(gateway?.is_active && !draft.is_active);
  const hasChanges = Object.keys(payloadState.payload).length > 0;
  const canSubmit = hasChanges && !payloadState.configError && (!isDeactivating || deactivationConfirmed) && !isSubmitting;

  const setCredential = (key: string, value: string) => { setCredentials((current) => ({ ...current, [key]: value })); setCredentialChanges((current) => ({ ...current, [key]: value })); };
  const resetCredential = (key: string) => { setCredentials((current) => ({ ...current, [key]: "" })); setCredentialChanges((current) => { const next = { ...current }; delete next[key]; return next; }); };
  const removeCredential = (key: string) => { setCredentials((current) => ({ ...current, [key]: "" })); setCredentialChanges((current) => ({ ...current, [key]: "" })); };
  const toggleUserType = (type: PaymentGatewayUserType) => setDraft((current) => ({ ...current, allowed_user_types: current.allowed_user_types.includes(type) ? current.allowed_user_types.filter((item) => item !== type) : [...current.allowed_user_types, type] }));

  const submit = async () => {
    if (!gateway || !canSubmit) return;
    setIsSubmitting(true);
    const result = await editPaymentGateway(gateway.id, payloadState.payload);
    if (!result?.ok) { setIsSubmitting(false); toast.error(result?.message || "فشل تعديل بوابة الدفع"); return; }
    await onSaved(gateway.id);
    onClose();
    showSuccessModal(result.message || "تم تعديل بوابة الدفع بنجاح");
  };

  const footer = gateway && !isError ? <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>إلغاء</Button><Button type="button" onClick={() => void submit()} disabled={!canSubmit} className="min-w-32">{isSubmitting ? <><LoaderCircle aria-hidden="true" className="animate-spin" /> جارٍ الحفظ...</> : "حفظ التعديلات"}</Button></div> : undefined;

  return (
    <Modal open={open} onClose={onClose} title={gateway ? `إعدادات ${gateway.name}` : "إعدادات بوابة الدفع"} description="تُطبق التغييرات على تكامل الدفع لهذا البلد. لا تُعرض القيم السرية كاملة بعد حفظها." contentClassName="md:max-w-[780px]" footer={footer}>
      {isError ? <div className="p-4"><QueryErrorState title="تعذر تحميل إعدادات بوابة الدفع" isRetrying={isRetrying} onRetry={onRetry} /></div> : isLoading || !gateway ? <GatewayFormShimmer /> : (
        <div className="space-y-6 p-1 text-right md:p-4">
          <GatewayIdentity gateway={gateway} />
          <FormSection title="التشغيل والأولوية" description="تتحكم هذه الإعدادات في قبول المدفوعات واختيار البوابة تلقائياً.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle label="البوابة نشطة" description="السماح باستخدام طرق الدفع المرتبطة" checked={draft.is_active} onChange={(value) => { setDraft((current) => ({ ...current, is_active: value, is_default: value ? current.is_default : false })); if (value) setDeactivationConfirmed(false); }} />
              <Toggle label="البوابة الافتراضية" description="اختيارها أولاً للمدفوعات المدعومة" checked={draft.is_default} disabled={!draft.is_active} onChange={(value) => setDraft((current) => ({ ...current, is_default: value }))} />
            </div>
            {draft.is_default && !gateway.is_default ? <InlineNotice>تعيين هذه البوابة كافتراضية سيلغي الافتراضية عن أي بوابة أخرى في البلد.</InlineNotice> : null}
            {isDeactivating ? <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950"><div className="flex items-start gap-3"><AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><div><p className="font-semibold">إيقاف البوابة يؤثر فوراً في الدفع</p><p className="mt-1 text-sm leading-6">ستُخفى {gateway.payment_methods_count.toLocaleString("ar-EG")} من طرق الدفع المرتبطة بها، وستُرفض محاولات الدفع من خلالها.</p><label className="mt-3 flex cursor-pointer items-start gap-2 text-sm font-medium"><input type="checkbox" checked={deactivationConfirmed} onChange={(event) => setDeactivationConfirmed(event.target.checked)} className="mt-0.5 size-4 accent-primary" />أفهم أثر الإيقاف وأريد متابعة الحفظ</label></div></div></div> : null}
          </FormSection>
          <FormSection title="نطاق الاستخدام" description="حدد العملات وأنواع الحسابات المسموح لها باستخدام البوابة.">
            <label className="block text-sm font-medium text-dark-gray">العملات المدعومة<span className="mt-1 block text-xs font-normal text-gray">افصل بين رموز العملات بفاصلة، مثل SAR, JOD</span><input dir="ltr" spellCheck={false} value={draft.supported_currencies} onChange={(event) => setDraft((current) => ({ ...current, supported_currencies: event.target.value }))} className={inputClass} placeholder="SAR, JOD" /></label>
            <fieldset className="mt-4 rounded-xl border border-primary/15 p-4"><legend className="px-1 text-sm font-medium text-dark-gray">أنواع المستخدمين</legend><div className="mt-2 flex flex-wrap gap-5">{([["merchant", "التجار"], ["driver", "السائقون"]] as const).map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={draft.allowed_user_types.includes(value)} onChange={() => toggleUserType(value)} className="size-5 accent-primary" />{label}</label>)}</div></fieldset>
          </FormSection>
          <FormSection title="مفاتيح الاتصال" description="اكتب قيمة جديدة فقط للمفتاح الذي تريد تغييره. القيم الحالية معروضة بشكل مقنّع للحماية." icon={<KeyRound aria-hidden="true" className="size-4" />}>
            {gateway.publishable_key ? <div className="mb-4 rounded-xl bg-neutral-50 p-3"><p className="text-xs text-gray">Publishable key</p><p dir="ltr" className="mt-1 break-all text-left font-mono text-xs text-secondary">{gateway.publishable_key}</p></div> : null}
            <div className="grid gap-4 sm:grid-cols-2">{credentialKeys(gateway).map((key) => { const changed = Object.hasOwn(credentialChanges, key); const removing = changed && credentialChanges[key] === ""; return <div key={key} className="rounded-xl border border-primary/15 p-3"><label className="block text-sm font-medium text-dark-gray">{credentialLabel(key)}<input dir="ltr" type="password" autoComplete="new-password" spellCheck={false} value={credentials[key] ?? ""} onChange={(event) => setCredential(key, event.target.value)} className={inputClass} placeholder={gateway.credentials?.[key] || "لا توجد قيمة محفوظة"} /></label><div className="mt-2 flex items-center justify-between gap-2 text-xs"><span className={removing ? "font-medium text-red-700" : "text-gray"}>{removing ? "سيُحذف المفتاح عند الحفظ" : changed ? "قيمة جديدة غير محفوظة" : "دون تغيير"}</span><div className="flex gap-1">{changed ? <Button type="button" variant="ghost" size="sm" onClick={() => resetCredential(key)}>تراجع</Button> : null}{!removing && gateway.credentials?.[key] ? <Button type="button" variant="ghost" size="sm" className="text-red-700 hover:text-red-800" onClick={() => removeCredential(key)}>حذف</Button> : null}</div></div></div>; })}</div>
          </FormSection>
          <FormSection title="إعدادات متقدمة" description="إعدادات المزود بصيغة JSON. عدّلها فقط وفق توثيق البوابة." icon={<ShieldCheck aria-hidden="true" className="size-4" />}>
            <label className="block text-sm font-medium text-dark-gray">Config (JSON)<textarea dir="ltr" rows={6} value={draft.config} onChange={(event) => setDraft((current) => ({ ...current, config: event.target.value }))} aria-invalid={payloadState.configError} aria-describedby={payloadState.configError ? "gateway-config-error" : undefined} className={`${inputClass} h-auto py-3 font-mono text-xs`} /></label>
            {payloadState.configError ? <p id="gateway-config-error" role="alert" className="mt-2 text-sm text-red-700">يجب أن تكون الإعدادات كائن JSON صالحاً، مثل {`{ "base_url": "https://..." }`}.</p> : null}
          </FormSection>
          {!hasChanges ? <p className="text-center text-xs text-gray">لم تُجرَ تغييرات بعد.</p> : null}
        </div>
      )}
    </Modal>
  );
}

const emptyDraft: GatewayDraft = { is_active: false, is_default: false, supported_currencies: "", allowed_user_types: [], config: "" };
const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-primary/20 bg-white px-3 text-left text-sm outline-none transition focus:border-[#8a6500] focus:ring-2 focus:ring-[#8a6500]/20 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-100";

function GatewayIdentity({ gateway }: { gateway: PaymentGateway }) { return <div className="flex flex-col gap-3 rounded-xl bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-secondary">{gateway.name}</p><StatusBadge active={gateway.is_active} /></div><p dir="ltr" className="mt-1 text-right font-mono text-xs text-gray">{gateway.key}</p></div><p className="text-sm text-gray"><span className="font-semibold tabular-nums text-secondary">{gateway.payment_methods_count.toLocaleString("ar-EG")}</span>{" "}طرق دفع مرتبطة</p></div>; }
function FormSection({ title, description, icon, children }: { title: string; description: string; icon?: ReactNode; children: ReactNode }) { return <section className="border-b border-border-subtle pb-6 last:border-0 last:pb-0"><div className="mb-4"><h3 className="flex items-center gap-2 font-semibold text-secondary">{icon}{title}</h3><p className="mt-1 text-sm leading-6 text-gray">{description}</p></div>{children}</section>; }
function Toggle({ label, description, checked, disabled = false, onChange }: { label: string; description: string; checked: boolean; disabled?: boolean; onChange: (value: boolean) => void }) { return <label className={`flex items-center justify-between gap-4 rounded-xl border border-primary/15 p-4 ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}`}><span><span className="block text-sm font-medium text-dark-gray">{label}</span><span className="mt-1 block text-xs leading-5 text-gray">{description}</span></span><input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="size-5 shrink-0 accent-primary" /></label>; }
function InlineNotice({ children }: { children: ReactNode }) { return <p className="mt-3 flex items-start gap-2 rounded-xl bg-primary/8 p-3 text-sm leading-6 text-secondary"><AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{children}</p>; }
function CurrencyBadges({ currencies }: { currencies: string[] }) { if (!currencies.length) return <span className="text-sm text-gray">غير محدد</span>; return <div className="flex flex-wrap gap-1.5">{currencies.map((currency) => <span key={currency} dir="ltr" className="rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs text-secondary">{currency}</span>)}</div>; }
function StatusBadge({ active }: { active: boolean }) { return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>{active ? "نشطة" : "متوقفة"}</span>; }
function formatUserTypes(types: PaymentGatewayUserType[] | null = []) { return (types ?? []).map((type) => type === "merchant" ? "التجار" : "السائقون").join("، ") || "غير محدد"; }
function credentialLabel(key: string) { return key.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
function GatewayFormShimmer() { return <div className="space-y-4 p-4">{Array.from({ length: 6 }).map((_, index) => <Shimmer key={index} className="h-12 w-full rounded-xl" />)}</div>; }
function GatewayShimmer() { return <div className="space-y-6"><Shimmer className="h-16 w-full rounded-xl" /><Shimmer className="h-14 w-full rounded-2xl" /><Shimmer className="h-96 w-full rounded-2xl" /></div>; }

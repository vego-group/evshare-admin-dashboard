"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Clock3,
  Database,
  History,
  LoaderCircle,
  PlayCircle,
  RefreshCw,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import DashboardDropdown from "@/components/ui/dashboard-dropdown";
import DatePicker from "@/components/ui/date-picker";
import Header from "@/components/ui/header";
import Modal from "@/components/ui/modal";
import QueryErrorState from "@/components/ui/query-error-state";
import { ADMIN_PERMISSIONS } from "@/constants";
import { useHasPermission } from "@/hooks";
import {
  useDataCleanupHistory,
  useDataCleanupModules,
  useDataCleanupRun,
} from "@/hooks/api";
import { cn } from "@/lib/utils";
import {
  cancelDataCleanup,
  executeDataCleanup,
  previewDataCleanup,
} from "@/services/mutations";
import type {
  DataCleanupErrorBody,
  DataCleanupModeKey,
  DataCleanupModule,
  DataCleanupModuleKey,
  DataCleanupRun,
  DataCleanupStatus,
} from "@/types";

import DataCleanupRunSummary, { StatusBadge } from "./run-summary";
import { formatDateTime, formatRemaining, statusLabels } from "./utils";

type Screen = "rules" | "review" | "history";
type RuleState = Record<DataCleanupModuleKey, {
  included: boolean;
  mode: DataCleanupModeKey;
  cutoff: string | null;
}>;

const statusOptions = (Object.keys(statusLabels) as DataCleanupStatus[]).map((value) => ({
  value,
  label: statusLabels[value],
}));

export default function DataCleanups() {
  const queryClient = useQueryClient();
  const canPreview = useHasPermission(ADMIN_PERMISSIONS.dataCleanups.preview);
  const canExecute = useHasPermission(ADMIN_PERMISSIONS.dataCleanups.execute);
  const canViewDetails = useHasPermission(ADMIN_PERMISSIONS.dataCleanups.details);
  const modulesQuery = useDataCleanupModules();
  const modulesData = modulesQuery.data?.data;

  const [screen, setScreen] = useState<Screen>("rules");
  const [rules, setRules] = useState<RuleState | null>(null);
  const [orderPayments, setOrderPayments] = useState<"keep" | "delete">("keep");
  const [activeRun, setActiveRun] = useState<DataCleanupRun | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [executeOpen, setExecuteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [backupReference, setBackupReference] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionError, setActionError] = useState<DataCleanupErrorBody | null>(null);
  const [now, setNow] = useState(Date.now());
  const [historyPage, setHistoryPage] = useState(1);
  const [historyStatus, setHistoryStatus] = useState<DataCleanupStatus | undefined>();

  const historyQuery = useDataCleanupHistory({
    page: historyPage,
    per_page: 10,
    status: historyStatus,
  });
  const isPolling = activeRun?.status === "queued" || activeRun?.status === "running";
  const runQuery = useDataCleanupRun(selectedRunId, isPolling);

  useEffect(() => {
    if (!modulesData || rules) return;
    setRules(buildInitialRules(modulesData.modules));
  }, [modulesData, rules]);

  useEffect(() => {
    if (!runQuery.data?.data) return;
    setActiveRun(runQuery.data.data);
    if (!["queued", "running"].includes(runQuery.data.data.status)) {
      void queryClient.invalidateQueries({ queryKey: ["data-cleanup-history"] });
    }
  }, [queryClient, runQuery.data]);

  useEffect(() => {
    if (activeRun?.status !== "previewed") return;
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [activeRun?.status]);

  const selectedCount = rules
    ? Object.values(rules).filter((rule) => rule.included).length
    : 0;
  const remaining = activeRun ? formatRemaining(activeRun.expires_at, now) : undefined;
  const phrase = modulesData?.confirmation_phrase || "DELETE";
  const canConfirm = confirmation === phrase && Boolean(activeRun?.can_execute) && !isExecuting;

  async function handlePreview() {
    if (!rules || !modulesData) return;
    const selected = modulesData.modules.filter((module) => rules[module.key].included);
    if (!selected.length) {
      toast.error("اختر وحدة واحدة على الأقل للمعاينة.");
      return;
    }
    const missingDate = selected.find((module) => {
      const rule = rules[module.key];
      return module.modes.find((mode) => mode.key === rule.mode)?.requires_cutoff && !rule.cutoff;
    });
    if (missingDate) {
      toast.error(`اختر تاريخ الحد لوحدة ${missingDate.name_ar}.`);
      return;
    }

    setIsPreviewing(true);
    setActionError(null);
    const result = await previewDataCleanup({
      modules: selected.map((module) => ({
        module: module.key,
        mode: rules[module.key].mode,
        cutoff: rules[module.key].mode === "before_date" ? rules[module.key].cutoff : null,
      })),
      order_payments: orderPayments,
    });
    setIsPreviewing(false);
    if (!result.ok || !result.data?.data) {
      toast.error(result.message || "تعذرت معاينة عملية التنظيف.");
      return;
    }
    setActiveRun(result.data.data);
    setSelectedRunId(result.data.data.id);
    setScreen("review");
    await queryClient.invalidateQueries({ queryKey: ["data-cleanup-history"] });
  }

  async function handleCancel() {
    if (!activeRun) return;
    setIsCancelling(true);
    const result = await cancelDataCleanup(activeRun.id);
    setIsCancelling(false);
    if (!result.ok || !result.data?.data) {
      toast.error(result.message || "تعذر إلغاء المعاينة.");
      return;
    }
    setActiveRun(result.data.data);
    toast.success("تم إلغاء المعاينة.");
    await queryClient.invalidateQueries({ queryKey: ["data-cleanup-history"] });
  }

  async function handleExecute() {
    if (!activeRun || !canConfirm) return;
    setIsExecuting(true);
    setActionError(null);
    const result = await executeDataCleanup(activeRun.id, {
      confirmation,
      ...(backupReference.trim() ? { backup_reference: backupReference.trim() } : {}),
    });
    setIsExecuting(false);
    if (!result.ok || !result.data?.data) {
      setActionError(result.error || { message: result.message });
      setExecuteOpen(false);
      toast.error(result.message || "تعذر بدء عملية التنظيف.");
      return;
    }
    setActiveRun(result.data.data);
    setSelectedRunId(result.data.data.id);
    setExecuteOpen(false);
    setConfirmation("");
    setBackupReference("");
    toast.success(result.data.data.status === "completed" ? "اكتملت عملية التنظيف والتحقق بنجاح." : "بدأت عملية التنظيف.");
    await queryClient.invalidateQueries({ queryKey: ["data-cleanup-history"] });
  }

  function openHistoryRun(run: DataCleanupRun) {
    if (!canViewDetails) return;
    setActionError(null);
    setActiveRun(run);
    setSelectedRunId(run.id);
    setScreen("review");
  }

  if (modulesQuery.isLoading || !rules) return <DataCleanupsShimmer />;
  if (modulesQuery.isError || !modulesData) {
    return <QueryErrorState title="تعذر تحميل وحدات تنظيف البيانات" onRetry={() => void modulesQuery.refetch()} isRetrying={modulesQuery.isFetching} />;
  }

  return (
    <div className="flex w-full flex-col gap-6" dir="rtl">
      <Header
        title="تنظيف البيانات"
        subtitle="عاين السجلات القديمة أو التجريبية، راجع الأعداد، ثم نفّذ الحذف بعد أخذ نسخة احتياطية والتحقق التلقائي."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-white p-2">
        <nav className="flex flex-wrap gap-1" aria-label="أقسام تنظيف البيانات">
          <TabButton active={screen === "rules"} onClick={() => setScreen("rules")} icon={Database}>قواعد التنظيف</TabButton>
          <TabButton active={screen === "review"} disabled={!activeRun} onClick={() => setScreen("review")} icon={PlayCircle}>المعاينة والنتيجة</TabButton>
          <TabButton active={screen === "history"} onClick={() => setScreen("history")} icon={History}>السجل</TabButton>
        </nav>
        <div className="px-3 py-2 text-xs text-text-muted">
          الدولة: <strong>{modulesData.tenant.toUpperCase()}</strong> · المنطقة الزمنية: <span dir="ltr">{modulesData.timezone}</span>
        </div>
      </div>

      {screen === "rules" ? (
        <RulesScreen
          modules={modulesData.modules}
          rules={rules}
          today={modulesData.today}
          orderPayments={orderPayments}
          selectedCount={selectedCount}
          canPreview={canPreview}
          isPreviewing={isPreviewing}
          onRuleChange={(key, patch) => setRules((current) => current ? ({ ...current, [key]: { ...current[key], ...patch } }) : current)}
          onOrderPaymentsChange={setOrderPayments}
          onPreview={handlePreview}
        />
      ) : null}

      {screen === "review" && activeRun ? (
        <div className="space-y-5">
          {runQuery.isFetching && isPolling ? (
            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <LoaderCircle className="size-4 animate-spin" /> يتم تحديث حالة العملية تلقائياً…
            </div>
          ) : null}
          {actionError ? <ActionError error={actionError} onPreviewAgain={() => { setScreen("rules"); setActionError(null); }} /> : null}
          <DataCleanupRunSummary run={activeRun} modules={modulesData.modules} remaining={remaining} />
          {activeRun.status === "previewed" ? (
            <div className="sticky bottom-4 flex flex-wrap justify-end gap-3 rounded-2xl border border-border-subtle bg-white/95 p-4 shadow-lg backdrop-blur">
              <Button variant="outline" onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? <LoaderCircle className="animate-spin" /> : <XCircle />} إلغاء المعاينة
              </Button>
              {canExecute ? (
                <Button variant="destructive" onClick={() => setExecuteOpen(true)} disabled={!activeRun.can_execute || remaining === "منتهية"}>
                  <Trash2 /> حذف البيانات
                </Button>
              ) : (
                <p className="self-center text-sm text-text-muted">يمكنك مشاركة المعاينة، لكنك لا تملك صلاحية التنفيذ.</p>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {screen === "history" ? (
        <HistoryScreen
          runs={historyQuery.data?.data ?? []}
          meta={historyQuery.data?.meta}
          isLoading={historyQuery.isLoading}
          isFetching={historyQuery.isFetching}
          isError={historyQuery.isError}
          status={historyStatus}
          page={historyPage}
          canViewDetails={canViewDetails}
          onStatusChange={(value) => { setHistoryStatus(value); setHistoryPage(1); }}
          onPageChange={setHistoryPage}
          onOpen={openHistoryRun}
          onRetry={() => void historyQuery.refetch()}
        />
      ) : null}

      <Modal
        open={executeOpen}
        onClose={() => { if (!isExecuting) setExecuteOpen(false); }}
        title="تأكيد حذف البيانات"
        description="هذا الإجراء لا يمكن التراجع عنه من لوحة التحكم. سيأخذ الخادم نسخة احتياطية أولاً."
        contentClassName="sm:max-w-lg"
        footer={
          <div className="flex w-full flex-row-reverse gap-3">
            <Button variant="destructive" onClick={handleExecute} disabled={!canConfirm} className="flex-1">
              {isExecuting ? <LoaderCircle className="animate-spin" /> : <Trash2 />} تأكيد الحذف
            </Button>
            <Button variant="outline" onClick={() => setExecuteOpen(false)} disabled={isExecuting}>رجوع</Button>
          </div>
        }
      >
        <div className="space-y-5 py-5">
          <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <ShieldAlert className="size-5 shrink-0" />
            <p>راجع أن عدد السجلات المحذوفة صحيح. ستعمل العملية على الدولة الحالية فقط: <strong>{modulesData.tenant.toUpperCase()}</strong>.</p>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-secondary">اكتب <bdi className="font-mono">{phrase}</bdi> للتأكيد</span>
            <input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
              dir="ltr"
              className="h-12 w-full rounded-xl border border-border-subtle px-4 font-mono text-sm"
              placeholder={phrase}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-secondary">مرجع لقطة قاعدة البيانات (اختياري)</span>
            <input
              value={backupReference}
              onChange={(event) => setBackupReference(event.target.value.slice(0, 255))}
              dir="ltr"
              className="h-12 w-full rounded-xl border border-border-subtle px-4 text-sm"
              placeholder="rds-snapshot-2026-10-12"
            />
            <span className="block text-xs text-text-muted">اتركه فارغاً ليأخذ الخادم نسخة احتياطية تلقائياً.</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}

function RulesScreen({ modules, rules, today, orderPayments, selectedCount, canPreview, isPreviewing, onRuleChange, onOrderPaymentsChange, onPreview }: {
  modules: DataCleanupModule[];
  rules: RuleState;
  today: string;
  orderPayments: "keep" | "delete";
  selectedCount: number;
  canPreview: boolean;
  isPreviewing: boolean;
  onRuleChange: (key: DataCleanupModuleKey, patch: Partial<RuleState[DataCleanupModuleKey]>) => void;
  onOrderPaymentsChange: (value: "keep" | "delete") => void;
  onPreview: () => void;
}) {
  const ordersIncluded = rules.orders?.included;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-2">
        {modules.map((module) => {
          const rule = rules[module.key];
          const selectedMode = module.modes.find((mode) => mode.key === rule.mode);
          return (
            <section key={module.key} className={cn("rounded-2xl border bg-white p-5 transition", rule.included ? "border-primary shadow-[0_4px_18px_rgba(15,23,42,0.05)]" : "border-border-subtle opacity-75")}>
              <div className="flex items-start justify-between gap-3">
                <label className="flex min-w-0 cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={rule.included} onChange={(event) => onRuleChange(module.key, { included: event.target.checked })} className="mt-1 size-5 accent-[#ffce27]" />
                  <span>
                    <span className="block font-semibold text-secondary">{module.name_ar}</span>
                    <span className="mt-1 block text-xs text-text-muted">{module.name_en}</span>
                  </span>
                </label>
                <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs text-text-muted">{module.tables.reduce((sum, table) => sum + table.total, 0).toLocaleString("ar-EG")} سجل</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-muted">طريقة التنظيف</label>
                  <DashboardDropdown
                    value={rule.mode}
                    options={module.modes.map((mode) => ({ value: mode.key, label: mode.name_ar }))}
                    onChange={(value) => {
                      const mode = module.modes.find((item) => item.key === value);
                      onRuleChange(module.key, { mode: value as DataCleanupModeKey, cutoff: mode?.requires_cutoff ? (rule.cutoff || module.default.cutoff) : null });
                    }}
                    placeholder="اختر الطريقة"
                    ariaLabel={`طريقة تنظيف ${module.name_ar}`}
                    disabled={!rule.included}
                  />
                </div>
                {selectedMode?.requires_cutoff ? (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-muted">حذف ما قبل تاريخ</label>
                    <DatePicker value={rule.cutoff} onChange={(cutoff) => onRuleChange(module.key, { cutoff: cutoff || null })} maxDate={today} disabled={!rule.included} />
                  </div>
                ) : <div />}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {module.tables.map((table) => (
                  <div key={table.table} className="rounded-xl bg-surface-subtle p-3 text-xs text-text-muted">
                    <div className="flex justify-between gap-2"><span className="font-mono" dir="ltr">{table.table}</span><strong>{table.total.toLocaleString("ar-EG")}</strong></div>
                    <div className="mt-2 flex justify-between gap-2"><span>الأقدم</span><span>{formatDateTime(table.oldest_created_at)}</span></div>
                    <div className="mt-1 flex justify-between gap-2"><span>الأحدث</span><span>{formatDateTime(table.newest_created_at)}</span></div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {ordersIncluded ? (
        <section className="rounded-2xl border border-border-subtle bg-white p-5">
          <h2 className="font-semibold text-secondary">مدفوعات الطلبات المحذوفة</h2>
          <p className="mt-1 text-sm text-text-muted">حدد مصير عمليات الدفع المرتبطة بالطلبات التي ستُحذف.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ChoiceCard checked={orderPayments === "keep"} onChange={() => onOrderPaymentsChange("keep")} title="الإبقاء على المدفوعات" description="الخيار الآمن الافتراضي؛ يصبح رابط الطلب فارغاً." />
            <ChoiceCard checked={orderPayments === "delete"} onChange={() => onOrderPaymentsChange("delete")} title="حذف مدفوعات الطلبات" description="تحذف عمليات الدفع التابعة للطلبات المشمولة." danger />
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-white p-4">
        <p className="text-sm text-text-muted">تم اختيار <strong className="text-secondary">{selectedCount.toLocaleString("ar-EG")}</strong> من {modules.length.toLocaleString("ar-EG")} وحدات. المعاينة لا تحذف أي بيانات.</p>
        {canPreview ? (
          <Button onClick={onPreview} disabled={!selectedCount || isPreviewing}>
            {isPreviewing ? <LoaderCircle className="animate-spin" /> : <PlayCircle />} معاينة الأعداد
          </Button>
        ) : <p className="text-sm text-red-700">ليس لديك صلاحية إنشاء معاينة.</p>}
      </div>
    </div>
  );
}

function HistoryScreen({ runs, meta, isLoading, isFetching, isError, status, page, canViewDetails, onStatusChange, onPageChange, onOpen, onRetry }: {
  runs: DataCleanupRun[];
  meta?: { currentPage: number; lastPage: number; perPage: number; total: number };
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  status?: DataCleanupStatus;
  page: number;
  canViewDetails: boolean;
  onStatusChange: (value: DataCleanupStatus | undefined) => void;
  onPageChange: (page: number) => void;
  onOpen: (run: DataCleanupRun) => void;
  onRetry: () => void;
}) {
  if (isError) return <QueryErrorState title="تعذر تحميل سجل عمليات التنظيف" onRetry={onRetry} isRetrying={isFetching} />;
  return (
    <section className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle p-5">
        <div><h2 className="text-lg font-semibold text-secondary">سجل العمليات</h2><p className="mt-1 text-sm text-text-muted">كل المعاينات ونتائج التنفيذ في الدولة الحالية.</p></div>
        <div className="flex items-center gap-2">
          {isFetching ? <RefreshCw className="size-4 animate-spin text-text-muted" /> : null}
          <DashboardDropdown
            value={status || ""}
            options={[{ value: "", label: "كل الحالات" }, ...statusOptions]}
            onChange={(value) => onStatusChange((value || undefined) as DataCleanupStatus | undefined)}
            placeholder="كل الحالات"
            ariaLabel="تصفية حسب الحالة"
            className="w-52"
          />
        </div>
      </div>
      {isLoading ? <div className="h-64 animate-pulse bg-neutral-50" /> : runs.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead><tr><th className="px-5">التاريخ</th><th className="px-5">الحالة</th><th className="px-5">الوحدات</th><th className="px-5">المعاينة بواسطة</th><th className="px-5"><span className="sr-only">التفاصيل</span></th></tr></thead>
            <tbody>{runs.map((run) => (
              <tr key={run.id}>
                <td className="px-5 whitespace-nowrap">{formatDateTime(run.created_at)}</td>
                <td className="px-5"><StatusBadge status={run.status} /></td>
                <td className="px-5">{run.modules.length.toLocaleString("ar-EG")}</td>
                <td className="px-5">{run.previewed_by?.name || "-"}</td>
                <td className="px-5 text-left"><Button variant="ghost" size="sm" disabled={!canViewDetails} onClick={() => onOpen(run)}>التفاصيل <ArrowLeft /></Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <div className="p-12 text-center text-sm text-text-muted">لا توجد عمليات مطابقة.</div>}
      {meta && meta.lastPage > 1 ? (
        <div className="flex items-center justify-between border-t border-border-subtle p-4 text-sm">
          <span className="text-text-muted">صفحة {page.toLocaleString("ar-EG")} من {meta.lastPage.toLocaleString("ar-EG")}</span>
          <div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1 || isFetching} onClick={() => onPageChange(page - 1)}>السابق</Button><Button variant="outline" size="sm" disabled={page >= meta.lastPage || isFetching} onClick={() => onPageChange(page + 1)}>التالي</Button></div>
        </div>
      ) : null}
    </section>
  );
}

function ActionError({ error, onPreviewAgain }: { error: DataCleanupErrorBody; onPreviewAgain: () => void }) {
  const recoverable = error.error_code === "DATA_CLEANUP_COUNTS_CHANGED" || error.error_code === "DATA_CLEANUP_PREVIEW_EXPIRED";
  const comparison = !Array.isArray(error.data) && error.data?.previewed && error.data.current
    ? Object.keys({ ...error.data.previewed, ...error.data.current }).map((key) => ({
        key,
        previewed: error.data && !Array.isArray(error.data) ? error.data.previewed?.[key] : undefined,
        current: error.data && !Array.isArray(error.data) ? error.data.current?.[key] : undefined,
      }))
    : [];
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      <div className="flex gap-3"><AlertTriangle className="size-5 shrink-0" /><div className="flex-1"><p className="font-semibold">تعذر تنفيذ عملية التنظيف</p><p className="mt-1">{error.message || "حدث خطأ غير متوقع."}</p></div></div>
      {comparison.length ? (
        <div className="mt-3 overflow-x-auto rounded-xl border border-red-100 bg-white">
          <table className="w-full min-w-md text-right text-xs">
            <thead><tr><th className="px-3 py-2">الوحدة</th><th className="px-3 py-2">وقت المعاينة</th><th className="px-3 py-2">الآن</th></tr></thead>
            <tbody>{comparison.map((row) => <tr key={row.key}><td className="px-3 py-2 font-mono" dir="ltr">{row.key}</td><td className="px-3 py-2">{row.previewed?.toLocaleString("ar-EG") ?? "-"}</td><td className="px-3 py-2 font-semibold">{row.current?.toLocaleString("ar-EG") ?? "-"}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
      {recoverable ? <Button variant="outline" size="sm" className="mt-3 border-red-200 bg-white" onClick={onPreviewAgain}><RefreshCw /> إنشاء معاينة جديدة</Button> : null}
    </div>
  );
}

function ChoiceCard({ checked, onChange, title, description, danger = false }: { checked: boolean; onChange: () => void; title: string; description: string; danger?: boolean }) {
  return <label className={cn("flex cursor-pointer gap-3 rounded-xl border p-4", checked ? (danger ? "border-red-300 bg-red-50" : "border-primary bg-primary/5") : "border-border-subtle")}><input type="radio" checked={checked} onChange={onChange} className="mt-1 size-4 accent-[#ffce27]" /><span><span className="block text-sm font-semibold text-secondary">{title}</span><span className="mt-1 block text-xs leading-5 text-text-muted">{description}</span></span></label>;
}

function TabButton({ active, disabled, onClick, icon: Icon, children }: { active: boolean; disabled?: boolean; onClick: () => void; icon: typeof Database; children: React.ReactNode }) {
  return <button type="button" disabled={disabled} onClick={onClick} className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition", active ? "bg-primary text-secondary" : "text-text-muted hover:bg-surface-subtle", disabled && "opacity-40")}><Icon className="size-4" />{children}</button>;
}

function DataCleanupsShimmer() {
  return <div className="space-y-5"><div className="h-20 animate-pulse rounded-2xl bg-white" /><div className="grid gap-4 xl:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-60 animate-pulse rounded-2xl bg-white" />)}</div></div>;
}

function buildInitialRules(modules: DataCleanupModule[]): RuleState {
  return Object.fromEntries(modules.map((module) => [module.key, {
    included: true,
    mode: module.default.mode,
    cutoff: module.default.cutoff,
  }])) as RuleState;
}

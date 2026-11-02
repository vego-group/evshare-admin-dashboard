"use client";

import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import QueryErrorState from "@/components/ui/query-error-state";
import { useWebsiteAuditLogs } from "@/hooks/api/website-cms";
import { CmsSkeleton, formatCmsDate, prettyJson, WebsiteCmsShell, websitePageNames } from "./shared";

const actionNames: Record<string, string> = { create: "إنشاء", update: "تعديل", delete: "حذف", show: "إظهار", hide: "إخفاء", reorder: "إعادة ترتيب", publish: "نشر", unpublish: "إلغاء نشر", discard_draft: "تجاهل المسودة", upload: "رفع" };

export default function WebsiteAuditLogsPage() {
  const [pageSlug, setPageSlug] = useState("");
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [page, setPage] = useState(1);
  const query = useWebsiteAuditLogs({ page_slug: pageSlug, action, entity_type: entityType, page, per_page: 20 });
  const logs = query.data?.data ?? [];
  const meta = query.data?.meta;
  const currentPage = meta?.currentPage ?? meta?.current_page ?? page;
  const lastPage = meta?.lastPage ?? meta?.last_page ?? 1;
  return (
    <WebsiteCmsShell title="سجل تغييرات الموقع" subtitle="سجل غير قابل للتعديل يوضح من غيّر محتوى الموقع ومتى، مع القيم السابقة والجديدة.">
      <div className="grid gap-3 rounded-2xl border border-border-subtle bg-white p-4 shadow-sm sm:grid-cols-3">
        <label className="grid gap-1 text-xs font-semibold text-text-muted">الصفحة<select value={pageSlug} onChange={(e) => { setPageSlug(e.target.value); setPage(1); }} className="h-11 rounded-xl border border-input bg-white px-3 text-sm text-secondary"><option value="">كل الصفحات</option>{Object.entries(websitePageNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="grid gap-1 text-xs font-semibold text-text-muted">الإجراء<select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="h-11 rounded-xl border border-input bg-white px-3 text-sm text-secondary"><option value="">كل الإجراءات</option>{Object.entries(actionNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="grid gap-1 text-xs font-semibold text-text-muted">نوع العنصر<select value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }} className="h-11 rounded-xl border border-input bg-white px-3 text-sm text-secondary"><option value="">كل الأنواع</option><option value="page">صفحة</option><option value="section">قسم</option><option value="settings">إعدادات</option><option value="media">وسائط</option></select></label>
      </div>
      {query.isLoading ? <CmsSkeleton /> : query.isError ? <QueryErrorState title="تعذّر تحميل سجل التغييرات" onRetry={() => void query.refetch()} isRetrying={query.isFetching} /> : (
        <>
          <div className="space-y-3">
            {logs.map((log) => (
              <article key={log.id} className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary"><Filter className="size-4" /></span><div><h2 className="font-bold text-secondary">{actionNames[log.action] ?? log.action} · {log.pageSlug ? websitePageNames[log.pageSlug] ?? log.pageSlug : log.entityType}{log.sectionKey ? ` / ${log.sectionKey}` : ""}</h2><p className="mt-1 text-xs text-text-muted">{log.admin?.name ?? "مستخدم غير معروف"}{log.ipAddress ? ` · ${log.ipAddress}` : ""}</p></div></div>
                  <time className="text-xs text-text-muted">{formatCmsDate(log.createdAt)}</time>
                </div>
                {(log.previousValue !== undefined || log.newValue !== undefined) && <details className="mt-4 rounded-xl border border-border-subtle"><summary className="flex cursor-pointer items-center justify-between p-3 text-sm font-semibold text-secondary">عرض الفرق <ChevronDown className="size-4" /></summary><div className="grid gap-3 border-t border-border-subtle p-3 lg:grid-cols-2"><div><p className="mb-2 text-xs font-bold text-text-muted">قبل</p><pre dir="ltr" className="max-h-80 overflow-auto rounded-lg bg-neutral-100 p-3 text-start text-xs leading-5">{prettyJson(log.previousValue)}</pre></div><div><p className="mb-2 text-xs font-bold text-text-muted">بعد</p><pre dir="ltr" className="max-h-80 overflow-auto rounded-lg bg-neutral-100 p-3 text-start text-xs leading-5">{prettyJson(log.newValue)}</pre></div></div></details>}
              </article>
            ))}
            {logs.length === 0 && <div className="rounded-2xl border border-dashed p-12 text-center text-text-muted">لا توجد تغييرات مطابقة.</div>}
          </div>
          <div className="flex items-center justify-center gap-3"><Button type="button" variant="outline" disabled={currentPage <= 1} onClick={() => setPage((value) => value - 1)}>السابق</Button><span className="text-sm text-text-muted">{currentPage} / {lastPage}</span><Button type="button" variant="outline" disabled={currentPage >= lastPage} onClick={() => setPage((value) => value + 1)}>التالي</Button></div>
        </>
      )}
    </WebsiteCmsShell>
  );
}

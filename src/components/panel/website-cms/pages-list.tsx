"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import QueryErrorState from "@/components/ui/query-error-state";
import { useWebsitePages } from "@/hooks/api/website-cms";
import { CmsSkeleton, formatCmsDate, StatusBadge, WebsiteCmsShell, websitePageNames } from "./shared";

export default function WebsitePagesList() {
  const query = useWebsitePages();
  const pages = query.data?.data ?? [];

  return (
    <WebsiteCmsShell title="محتوى الموقع الإلكتروني" subtitle="حرّر مسودات صفحات evshare.app وراجعها قبل نشرها دون الحاجة إلى إصدار جديد للموقع.">
      {query.isLoading ? <CmsSkeleton /> : query.isError ? (
        <QueryErrorState title="تعذّر تحميل صفحات الموقع" onRetry={() => void query.refetch()} isRetrying={query.isFetching} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {pages.map((page) => (
            <article key={page.slug} className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-secondary">{websitePageNames[page.slug] ?? page.slug}</h2>
                    <StatusBadge tone={page.isLive ? "green" : "gray"}>{page.isLive ? "منشورة" : "غير منشورة"}</StatusBadge>
                    {page.hasUnpublishedChanges && <StatusBadge tone="orange">تغييرات غير منشورة</StatusBadge>}
                    {!page.isActive && <StatusBadge tone="red">معطّلة</StatusBadge>}
                  </div>
                  <p dir="ltr" className="text-start text-sm text-text-muted">/{page.slug}</p>
                </div>
                <ExternalLink className="size-5 shrink-0 text-text-muted" aria-hidden="true" />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-neutral-50 p-3"><dt className="text-text-muted">الأقسام</dt><dd className="mt-1 font-bold text-secondary">{page.sectionsCount}</dd></div>
                <div className="rounded-xl bg-neutral-50 p-3"><dt className="text-text-muted">نسخة المسودة</dt><dd className="mt-1 font-bold text-secondary">v{page.version}</dd></div>
              </dl>
              <p className="mt-4 text-xs text-text-muted">آخر تعديل: {formatCmsDate(page.updatedAt)}{page.updatedBy?.name ? ` · ${page.updatedBy.name}` : ""}</p>
              <Link href={`/website/pages/${page.slug}`} className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-semibold text-white transition hover:bg-secondary/90">
                إدارة الصفحة <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
          {pages.length === 0 && <div className="col-span-full rounded-2xl border border-dashed p-12 text-center text-text-muted">لا توجد صفحات متاحة.</div>}
        </div>
      )}
    </WebsiteCmsShell>
  );
}

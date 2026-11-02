"use client";

import { useRef, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileImage, Search, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import QueryErrorState from "@/components/ui/query-error-state";
import { ADMIN_PERMISSIONS } from "@/constants/permissions";
import { useWebsiteMedia } from "@/hooks/api/website-cms";
import { deleteWebsiteMediaAPI, uploadWebsiteMediaAPI } from "@/services/mutations/website-cms";
import { CmsSkeleton, formatCmsDate, StatusBadge, WebsiteCmsShell } from "./shared";

const formatBytes = (bytes: number) => bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function WebsiteMediaPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busy, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const query = useWebsiteMedia({ search, page, per_page: 20 });
  const media = query.data?.data ?? [];
  const meta = query.data?.meta;
  const currentPage = meta?.currentPage ?? meta?.current_page ?? page;
  const lastPage = meta?.lastPage ?? meta?.last_page ?? 1;
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["website", "media"] });

  const upload = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("الحد الأقصى لحجم الصورة هو 5 MB");
    const form = new FormData();
    form.append("file", file);
    startTransition(async () => {
      const result = await uploadWebsiteMediaAPI(form);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("تم رفع الصورة");
      if (fileRef.current) fileRef.current.value = "";
      refresh();
    });
  };

  const remove = (id: string) => startTransition(async () => {
    const result = await deleteWebsiteMediaAPI(id);
    if (!result.ok) {
      toast.error(result.error?.error_code === "WEBSITE_MEDIA_IN_USE" ? "لا يمكن حذف الصورة لأنها مستخدمة في محتوى منشور أو في الإعدادات." : result.message);
      return;
    }
    toast.success("تم حذف الصورة");
    refresh();
  });

  return (
    <WebsiteCmsShell title="مكتبة وسائط الموقع" subtitle="ارفع صور الموقع وتحقق من أماكن استخدامها قبل الاستبدال أو الحذف.">
      <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="relative min-w-0 flex-1 sm:max-w-md"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" /><span className="sr-only">بحث باسم الملف</span><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="ابحث باسم الملف..." className="h-11 w-full rounded-xl border border-input ps-10 pe-3" /></label>
        <PermissionGate slug={ADMIN_PERMISSIONS.website.media}>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
          <Button type="button" disabled={busy} onClick={() => fileRef.current?.click()}><Upload /> رفع صورة</Button>
        </PermissionGate>
      </div>
      <p className="text-xs text-text-muted">JPEG، PNG، WebP أو SVG · حتى 5 MB. قد يعطّل الخادم SVG حسب بيئة التشغيل.</p>
      {query.isLoading ? <CmsSkeleton /> : query.isError ? <QueryErrorState title="تعذّر تحميل مكتبة الوسائط" onRetry={() => void query.refetch()} isRetrying={query.isFetching} /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {media.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
                <div className="grid aspect-video place-items-center bg-neutral-100 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${JSON.stringify(item.url).slice(1, -1)})` }}><FileImage className="size-8 text-neutral-300" aria-hidden="true" /></div>
                <div className="space-y-3 p-4">
                  <div><h2 dir="ltr" title={item.originalName} className="truncate text-start text-sm font-bold text-secondary">{item.originalName}</h2><p className="mt-1 text-xs text-text-muted">{formatBytes(item.size)}{item.width && item.height ? ` · ${item.width}×${item.height}` : ""}</p></div>
                  <div className="flex flex-wrap gap-2">{item.inPublishedUse ? <StatusBadge tone="green">مستخدمة في المنشور</StatusBadge> : item.inUse ? <StatusBadge tone="orange">مستخدمة في مسودة</StatusBadge> : <StatusBadge tone="gray">غير مستخدمة</StatusBadge>}</div>
                  {item.inUse && <details className="text-xs text-text-muted"><summary className="cursor-pointer">أماكن الاستخدام</summary><ul dir="ltr" className="mt-2 list-inside list-disc text-start">{[...item.usage.published, ...item.usage.draft, ...item.usage.settings].map((place) => <li key={place}>{place}</li>)}</ul></details>}
                  <p className="text-xs text-text-muted">{formatCmsDate(item.createdAt)}</p>
                  <div className="flex gap-2"><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-input text-xs font-semibold">فتح الصورة</a><PermissionGate slug={ADMIN_PERMISSIONS.website.media}><Button type="button" size="icon" variant="ghost" className="text-red-600" disabled={busy || item.inPublishedUse} title={item.inPublishedUse ? "استبدل الصورة في المحتوى المنشور أولًا" : "حذف"} onClick={() => { if (window.confirm("هل تريد حذف هذه الصورة؟")) remove(item.id); }}><Trash2 /></Button></PermissionGate></div>
                </div>
              </article>
            ))}
            {media.length === 0 && <div className="col-span-full rounded-2xl border border-dashed p-12 text-center text-text-muted">لا توجد صور مطابقة.</div>}
          </div>
          <div className="flex items-center justify-center gap-3"><Button type="button" variant="outline" disabled={currentPage <= 1} onClick={() => setPage((value) => value - 1)}>السابق</Button><span className="text-sm text-text-muted">{currentPage} / {lastPage}</span><Button type="button" variant="outline" disabled={currentPage >= lastPage} onClick={() => setPage((value) => value + 1)}>التالي</Button></div>
        </>
      )}
    </WebsiteCmsShell>
  );
}

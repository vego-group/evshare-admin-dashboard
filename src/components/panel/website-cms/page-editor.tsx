"use client";

import { useMemo, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, Plus, RefreshCw, Save, Send, Trash2, Undo2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import PermissionGate from "@/components/permission-gate";
import QueryErrorState from "@/components/ui/query-error-state";
import { ADMIN_PERMISSIONS } from "@/constants/permissions";
import { useWebsitePage } from "@/hooks/api/website-cms";
import {
  addWebsiteSectionAPI,
  deleteWebsiteSectionAPI,
  discardWebsiteDraftAPI,
  publishWebsitePageAPI,
  reorderWebsiteSectionsAPI,
  setWebsiteSectionVisibilityAPI,
  unpublishWebsitePageAPI,
  updateWebsitePageAPI,
  updateWebsiteSectionAPI,
} from "@/services/mutations/website-cms";
import { websitePreviewAPI } from "@/services/queries/website-cms";
import type { ApiResult, WebsiteApiError, WebsitePageDetail, WebsiteSection } from "@/types";
import { CmsSkeleton, formatCmsDate, parseJson, prettyJson, StatusBadge, WebsiteCmsShell, websitePageNames } from "./shared";

type CmsResult = ApiResult<unknown, WebsiteApiError>;

function JsonField({ label, value, onChange, dir = "ltr" }: { label: string; value: string; onChange: (value: string) => void; dir?: "ltr" | "rtl" }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-secondary">
      {label}
      <textarea
        dir={dir}
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-56 w-full rounded-xl border border-input bg-white p-3 font-mono text-xs font-normal leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function SectionEditor({
  section,
  page,
  index,
  count,
  busy,
  run,
  move,
}: {
  section: WebsiteSection;
  page: WebsitePageDetail;
  index: number;
  count: number;
  busy: boolean;
  run: (action: () => Promise<CmsResult>, message: string) => void;
  move: (index: number, direction: -1 | 1) => void;
}) {
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  const [contentAr, setContentAr] = useState(prettyJson(section.contentAr));
  const [contentEn, setContentEn] = useState(prettyJson(section.contentEn));
  const [settings, setSettings] = useState(prettyJson(section.settings));

  const save = () => {
    try {
      run(
        () => updateWebsiteSectionAPI(page.slug, section.key, {
          version: page.version,
          content_ar: parseJson(contentAr, "المحتوى العربي"),
          content_en: parseJson(contentEn, "المحتوى الإنجليزي"),
          settings: parseJson(settings, "إعدادات القسم"),
        }),
        `تم حفظ قسم ${section.key} في المسودة`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "صيغة JSON غير صالحة");
    }
  };

  return (
    <article className="rounded-2xl border border-border-subtle bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-neutral-100 text-xs font-bold text-secondary">{index + 1}</span>
          <div><h3 dir="ltr" className="text-start font-bold text-secondary">{section.key}</h3><p className="text-xs text-text-muted">ترتيب {section.sortOrder}</p></div>
          <StatusBadge tone={section.isVisible ? "green" : "gray"}>{section.isVisible ? "ظاهر" : "مخفي"}</StatusBadge>
        </div>
        <PermissionGate slug={ADMIN_PERMISSIONS.website.edit}>
          <div className="flex flex-wrap gap-1">
            <Button type="button" size="icon-sm" variant="ghost" disabled={busy || index === 0} onClick={() => move(index, -1)} aria-label="نقل لأعلى"><ArrowUp /></Button>
            <Button type="button" size="icon-sm" variant="ghost" disabled={busy || index === count - 1} onClick={() => move(index, 1)} aria-label="نقل لأسفل"><ArrowDown /></Button>
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => run(() => setWebsiteSectionVisibilityAPI(page.slug, section.key, { version: page.version, is_visible: !section.isVisible }), section.isVisible ? "تم إخفاء القسم من المسودة" : "تم إظهار القسم في المسودة")}>
              {section.isVisible ? "إخفاء" : "إظهار"}
            </Button>
            <Button type="button" size="icon-sm" variant="ghost" disabled={busy} className="text-red-600" aria-label="حذف القسم" onClick={() => {
              if (window.confirm(`هل تريد حذف قسم ${section.key} من المسودة؟`)) run(() => deleteWebsiteSectionAPI(page.slug, section.key, page.version), "تم حذف القسم");
            }}><Trash2 /></Button>
          </div>
        </PermissionGate>
      </header>
      <div className="space-y-4 p-4">
        <div className="flex gap-2" role="tablist" aria-label="لغة المحتوى">
          <button type="button" onClick={() => setLocale("ar")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${locale === "ar" ? "bg-secondary text-white" : "bg-neutral-100 text-text-muted"}`}>العربية</button>
          <button type="button" onClick={() => setLocale("en")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${locale === "en" ? "bg-secondary text-white" : "bg-neutral-100 text-text-muted"}`}>English</button>
        </div>
        {locale === "ar" ? <JsonField label="المحتوى العربي" dir="rtl" value={contentAr} onChange={setContentAr} /> : <JsonField label="English content" value={contentEn} onChange={setContentEn} />}
        <details className="rounded-xl border border-border-subtle p-3">
          <summary className="cursor-pointer text-sm font-semibold text-secondary">إعدادات مشتركة بين اللغتين</summary>
          <div className="mt-3"><JsonField label="settings" value={settings} onChange={setSettings} /></div>
        </details>
        <PermissionGate slug={ADMIN_PERMISSIONS.website.edit}>
          <div className="flex justify-end"><Button type="button" disabled={busy} onClick={save}><Save /> حفظ القسم في المسودة</Button></div>
        </PermissionGate>
      </div>
    </article>
  );
}

function SeoEditor({ page, busy, run }: { page: WebsitePageDetail; busy: boolean; run: (action: () => Promise<CmsResult>, message: string) => void }) {
  const [seo, setSeo] = useState({
    titleAr: page.seo.titleAr ?? "",
    titleEn: page.seo.titleEn ?? "",
    descriptionAr: page.seo.descriptionAr ?? "",
    descriptionEn: page.seo.descriptionEn ?? "",
  });
  return (
    <section className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5"><h2 className="text-lg font-bold text-secondary">تحسين محركات البحث (SEO)</h2><p className="mt-1 text-sm text-text-muted">العنوان مطلوب باللغتين قبل النشر.</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">العنوان العربي<input dir="rtl" maxLength={255} value={seo.titleAr} onChange={(e) => setSeo({ ...seo, titleAr: e.target.value })} className="h-11 rounded-xl border border-input px-3 font-normal" /></label>
        <label className="grid gap-2 text-sm font-semibold">English title<input dir="ltr" maxLength={255} value={seo.titleEn} onChange={(e) => setSeo({ ...seo, titleEn: e.target.value })} className="h-11 rounded-xl border border-input px-3 font-normal" /></label>
        <label className="grid gap-2 text-sm font-semibold">الوصف العربي<textarea dir="rtl" maxLength={1000} value={seo.descriptionAr} onChange={(e) => setSeo({ ...seo, descriptionAr: e.target.value })} className="min-h-24 rounded-xl border border-input p-3 font-normal" /></label>
        <label className="grid gap-2 text-sm font-semibold">English description<textarea dir="ltr" maxLength={1000} value={seo.descriptionEn} onChange={(e) => setSeo({ ...seo, descriptionEn: e.target.value })} className="min-h-24 rounded-xl border border-input p-3 font-normal" /></label>
      </div>
      <PermissionGate slug={ADMIN_PERMISSIONS.website.edit}><div className="mt-4 flex justify-end"><Button type="button" disabled={busy} onClick={() => run(() => updateWebsitePageAPI(page.slug, { version: page.version, seo_title_ar: seo.titleAr, seo_title_en: seo.titleEn, seo_description_ar: seo.descriptionAr, seo_description_en: seo.descriptionEn }), "تم حفظ بيانات SEO في المسودة")}><Save /> حفظ SEO</Button></div></PermissionGate>
    </section>
  );
}

export default function WebsitePageEditor() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useWebsitePage(slug);
  const page = query.data?.data;
  const [busy, startTransition] = useTransition();
  const [preview, setPreview] = useState<unknown>(null);
  const [previewLocale, setPreviewLocale] = useState<"ar" | "en">("ar");
  const [newKey, setNewKey] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["website", "pages"] });
    void queryClient.invalidateQueries({ queryKey: ["website", "pages", slug] });
  };

  const run = (action: () => Promise<CmsResult>, message: string) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error?.error_code === "WEBSITE_VERSION_CONFLICT" ? "عُدّلت الصفحة بواسطة مستخدم آخر. أعد تحميلها ثم حاول مجددًا." : result.message);
        if (result.error?.error_code === "WEBSITE_VERSION_CONFLICT") await query.refetch();
        return;
      }
      toast.success(message);
      refresh();
    });
  };

  const orderedSections = useMemo(() => [...(page?.sections ?? [])].sort((a, b) => a.sortOrder - b.sortOrder), [page?.sections]);
  const previewErrors = useMemo(() => {
    if (!preview || typeof preview !== "object") return {} as Record<string, unknown>;
    const container = "data" in preview && preview.data && typeof preview.data === "object" ? preview.data : preview;
    if (!("publishErrors" in container) || !container.publishErrors || typeof container.publishErrors !== "object") return {} as Record<string, unknown>;
    return container.publishErrors as Record<string, unknown>;
  }, [preview]);
  const previewBlocksPublish = Object.keys(previewErrors).length > 0;
  const move = (index: number, direction: -1 | 1) => {
    if (!page) return;
    const keys = orderedSections.map((section) => section.key);
    [keys[index], keys[index + direction]] = [keys[index + direction], keys[index]];
    run(() => reorderWebsiteSectionsAPI(page.slug, { version: page.version, sections: keys }), "تم تحديث ترتيب الأقسام في المسودة");
  };

  if (query.isLoading) return <WebsiteCmsShell title="إدارة صفحة الموقع" subtitle="جارٍ تحميل المسودة..."><CmsSkeleton /></WebsiteCmsShell>;
  if (query.isError || !page) return <WebsiteCmsShell title="إدارة صفحة الموقع" subtitle="تعذّر تحميل الصفحة"><QueryErrorState title="تعذّر تحميل صفحة الموقع" onRetry={() => void query.refetch()} isRetrying={query.isFetching} /></WebsiteCmsShell>;

  return (
    <WebsiteCmsShell title={websitePageNames[page.slug] ?? page.slug} subtitle={`إدارة مسودة /${page.slug} · تحفظ التعديلات كمسودة حتى يتم نشرها.`}>
      <section className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={page.isLive ? "green" : "gray"}>{page.isLive ? "متاحة على الموقع" : "غير منشورة"}</StatusBadge>
            <StatusBadge tone={page.hasUnpublishedChanges ? "orange" : "gray"}>{page.hasUnpublishedChanges ? "تغييرات غير منشورة" : "المسودة مطابقة للنسخة المنشورة"}</StatusBadge>
            <StatusBadge tone={page.isActive ? "green" : "red"}>{page.isActive ? "مفعّلة" : "معطّلة"}</StatusBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" disabled={busy} onClick={() => void query.refetch()}><RefreshCw /> تحديث</Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => startTransition(async () => {
              try { setPreview(await websitePreviewAPI(page.slug, previewLocale)); } catch (error) { toast.error(error instanceof Error ? error.message : "تعذرت المعاينة"); }
            })}><Eye /> معاينة {previewLocale === "ar" ? "العربية" : "English"}</Button>
            <select aria-label="لغة المعاينة" value={previewLocale} onChange={(event) => setPreviewLocale(event.target.value as "ar" | "en")} className="rounded-xl border border-input bg-white px-3 text-sm"><option value="ar">AR</option><option value="en">EN</option></select>
            <PermissionGate slug={ADMIN_PERMISSIONS.website.edit}>
              {page.hasUnpublishedChanges && page.published && <Button type="button" variant="outline" disabled={busy} onClick={() => { if (window.confirm("سيتم حذف كل التعديلات غير المنشورة. هل أنت متأكد؟")) run(() => discardWebsiteDraftAPI(page.slug, page.version), "تمت استعادة النسخة المنشورة"); }}><Undo2 /> تجاهل المسودة</Button>}
            </PermissionGate>
            <PermissionGate slug={ADMIN_PERMISSIONS.website.publish}>
              <Button type="button" variant="outline" disabled={busy} onClick={() => run(() => updateWebsitePageAPI(page.slug, { version: page.version, is_active: !page.isActive }), page.isActive ? "تم تعطيل الصفحة على الموقع" : "تم تفعيل الصفحة على الموقع")}>
                {page.isActive ? "تعطيل الصفحة" : "تفعيل الصفحة"}
              </Button>
              {page.isLive && <Button type="button" variant="destructive" disabled={busy} onClick={() => { if (window.confirm("هل تريد إلغاء نشر الصفحة؟ سيظهر خطأ 404 للزوار.")) run(() => unpublishWebsitePageAPI(page.slug, page.version), "تم إلغاء نشر الصفحة"); }}>إلغاء النشر</Button>}
              <Button type="button" title={previewBlocksPublish ? "أصلح أخطاء المعاينة قبل النشر" : undefined} disabled={busy || !page.hasUnpublishedChanges || previewBlocksPublish} onClick={() => run(() => publishWebsitePageAPI(page.slug, page.version), "تم نشر الصفحة بنجاح")}><Send /> نشر</Button>
            </PermissionGate>
          </div>
        </div>
        <p className="mt-4 text-xs text-text-muted">مسودة v{page.version} · آخر تعديل {formatCmsDate(page.updatedAt)}{page.updatedBy?.name ? ` بواسطة ${page.updatedBy.name}` : ""}</p>
      </section>

      {preview !== null && (
        <section className="rounded-2xl border border-primary/40 bg-[#fffbeb] p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-secondary">بيانات المعاينة</h2><button type="button" className="text-sm text-text-muted underline" onClick={() => setPreview(null)}>إغلاق</button></div>
          {previewBlocksPublish && <div role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"><p className="font-bold">لا يمكن نشر هذه المسودة قبل إصلاح الأخطاء التالية:</p><ul dir="ltr" className="mt-2 list-inside list-disc text-start">{Object.entries(previewErrors).map(([field, message]) => <li key={field}>{field}: {Array.isArray(message) ? message.join("، ") : String(message)}</li>)}</ul></div>}
          <pre dir="ltr" className="max-h-96 overflow-auto rounded-xl bg-secondary p-4 text-start text-xs leading-6 text-white">{prettyJson(preview)}</pre>
        </section>
      )}

      <SeoEditor key={page.version} page={page} busy={busy} run={run} />

      <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold text-secondary">أقسام الصفحة</h2><p className="mt-1 text-sm text-text-muted">يمكن تعديل اللغتين، الإظهار، الحذف والترتيب. الحقول تُحفظ بصيغة المحتوى التي يتوقعها الموقع.</p></div></div>
      <div className="space-y-4">{orderedSections.map((section, index) => <SectionEditor key={`${section.id || section.key}-${page.version}`} section={section} page={page} index={index} count={orderedSections.length} busy={busy} run={run} move={move} />)}</div>

      <PermissionGate slug={ADMIN_PERMISSIONS.website.edit}>
        <section className="rounded-2xl border border-dashed border-primary/60 bg-[#fffdf5] p-5">
          <h2 className="flex items-center gap-2 font-bold text-secondary"><Plus className="size-5" /> إضافة قسم</h2>
          <p className="mt-1 text-sm text-text-muted">مفيد خصوصًا لإضافة بنود سياسة الخصوصية والشروط. المفتاح أحرف إنجليزية صغيرة وأرقام وشرطة سفلية.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input dir="ltr" placeholder="section_key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="h-11 rounded-xl border border-input px-3" />
            <input placeholder="العنوان العربي" value={newTitleAr} onChange={(e) => setNewTitleAr(e.target.value)} className="h-11 rounded-xl border border-input px-3" />
            <input dir="ltr" placeholder="English title" value={newTitleEn} onChange={(e) => setNewTitleEn(e.target.value)} className="h-11 rounded-xl border border-input px-3" />
          </div>
          <div className="mt-4 flex justify-end"><Button type="button" disabled={busy || !/^[a-z][a-z0-9_]*$/.test(newKey) || !newTitleAr || !newTitleEn} onClick={() => run(() => addWebsiteSectionAPI(page.slug, { version: page.version, section_key: newKey, content_ar: { title: newTitleAr, body: "" }, content_en: { title: newTitleEn, body: "" }, is_visible: true }), "تمت إضافة القسم إلى المسودة")}><Plus /> إضافة القسم</Button></div>
        </section>
      </PermissionGate>
      <button type="button" className="text-sm text-text-muted underline" onClick={() => router.push("/website/pages")}>العودة إلى قائمة الصفحات</button>
    </WebsiteCmsShell>
  );
}

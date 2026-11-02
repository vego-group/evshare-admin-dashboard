"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Save } from "lucide-react";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import QueryErrorState from "@/components/ui/query-error-state";
import { ADMIN_PERMISSIONS } from "@/constants/permissions";
import { useWebsiteSettings } from "@/hooks/api/website-cms";
import { updateWebsiteSettingsAPI } from "@/services/mutations/website-cms";
import type { WebsiteSettingGroup } from "@/types";
import { CmsSkeleton, formatCmsDate, parseJson, prettyJson, WebsiteCmsShell } from "./shared";

const groupNames: Record<string, string> = {
  general: "هوية الموقع",
  navbar: "شريط التنقل",
  footer: "تذييل الموقع",
  contact: "بيانات التواصل",
  social: "الشبكات الاجتماعية",
  apps: "روابط التطبيقات",
  seo: "SEO الافتراضي",
};

function SettingsGroupCard({ group, busy, onSaved }: { group: WebsiteSettingGroup; busy: boolean; onSaved: () => void }) {
  const [contentAr, setContentAr] = useState(prettyJson(group.contentAr));
  const [contentEn, setContentEn] = useState(prettyJson(group.contentEn));
  const [settings, setSettings] = useState(prettyJson(group.settings));
  const [pending, startTransition] = useTransition();

  const save = () => {
    let payload: Record<string, unknown>;
    try {
      payload = {
        version: group.version,
        content_ar: parseJson(contentAr, "المحتوى العربي"),
        content_en: parseJson(contentEn, "المحتوى الإنجليزي"),
        settings: parseJson(settings, "الإعدادات"),
      };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "صيغة JSON غير صالحة");
      return;
    }
    startTransition(async () => {
      const result = await updateWebsiteSettingsAPI({ [group.key]: payload });
      if (!result.ok) {
        toast.error(result.error?.error_code === "WEBSITE_VERSION_CONFLICT" ? "عُدّلت هذه المجموعة بواسطة مستخدم آخر. حدّث الصفحة وحاول مجددًا." : result.message);
        return;
      }
      toast.success("تم تحديث الموقع مباشرة");
      onSaved();
    });
  };

  return (
    <article className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-lg font-bold text-secondary">{groupNames[group.key] ?? group.key}</h2><p dir="ltr" className="mt-1 text-start text-xs text-text-muted">{group.key} · v{group.version}</p></div>
        <p className="text-xs text-text-muted">آخر تحديث {formatCmsDate(group.updatedAt)}{group.updatedBy?.name ? ` · ${group.updatedBy.name}` : ""}</p>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold">المحتوى العربي<textarea dir="rtl" spellCheck={false} value={contentAr} onChange={(e) => setContentAr(e.target.value)} className="min-h-64 rounded-xl border border-input p-3 font-mono text-xs font-normal leading-6" /></label>
        <label className="grid gap-2 text-sm font-semibold">English content<textarea dir="ltr" spellCheck={false} value={contentEn} onChange={(e) => setContentEn(e.target.value)} className="min-h-64 rounded-xl border border-input p-3 font-mono text-xs font-normal leading-6" /></label>
        <label className="grid gap-2 text-sm font-semibold">إعدادات مشتركة<textarea dir="ltr" spellCheck={false} value={settings} onChange={(e) => setSettings(e.target.value)} className="min-h-64 rounded-xl border border-input p-3 font-mono text-xs font-normal leading-6" /></label>
      </div>
      <PermissionGate slug={ADMIN_PERMISSIONS.website.edit}><div className="mt-4 flex justify-end"><Button type="button" disabled={busy || pending} onClick={save}><Save /> حفظ وتحديث الموقع</Button></div></PermissionGate>
    </article>
  );
}

export default function WebsiteSettingsPage() {
  const query = useWebsiteSettings();
  const queryClient = useQueryClient();
  const groups = query.data?.data ?? [];
  return (
    <WebsiteCmsShell title="إعدادات الموقع العامة" subtitle="إدارة الشعار والتنقل والتذييل والتواصل وروابط التطبيقات وSEO الافتراضي.">
      <div role="note" className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle className="mt-0.5 size-5 shrink-0" /><div><p className="font-bold">هذه الإعدادات لا تستخدم مسودة.</p><p className="mt-1">أي حفظ هنا يحدّث الموقع العام مباشرة، لذلك راجع اللغتين والروابط قبل المتابعة.</p></div></div>
      {query.isLoading ? <CmsSkeleton /> : query.isError ? <QueryErrorState title="تعذّر تحميل إعدادات الموقع" onRetry={() => void query.refetch()} isRetrying={query.isFetching} /> : (
        <div className="space-y-4">{groups.map((group) => <SettingsGroupCard key={`${group.key}-${group.version}`} group={group} busy={query.isFetching} onSaved={() => void queryClient.invalidateQueries({ queryKey: ["website", "settings"] })} />)}</div>
      )}
    </WebsiteCmsShell>
  );
}

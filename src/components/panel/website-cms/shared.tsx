"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FileClock, FileText, Images, Settings } from "lucide-react";

import PageShell from "@/components/ui/page-shell";
import Header from "@/components/ui/header";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/website/pages", label: "الصفحات", icon: FileText },
  { href: "/website/settings", label: "الإعدادات العامة", icon: Settings },
  { href: "/website/media", label: "مكتبة الوسائط", icon: Images },
  { href: "/website/audit-logs", label: "سجل التغييرات", icon: FileClock },
];

export const websitePageNames: Record<string, string> = {
  home: "الرئيسية",
  about: "من نحن",
  contact: "تواصل معنا",
  "privacy-policy": "سياسة الخصوصية",
  "terms-of-service": "الشروط والأحكام",
};

export function WebsiteCmsShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <PageShell>
      <div className="space-y-6">
        <Header title={title} subtitle={subtitle} />
        <nav aria-label="أقسام إدارة الموقع" className="flex gap-2 overflow-x-auto rounded-2xl border border-border-subtle bg-white p-2 shadow-sm">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === "/website/pages" && /^\/website\/pages\//.test(pathname));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
                  active ? "bg-primary text-secondary" : "text-text-muted hover:bg-neutral-50 hover:text-secondary",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </PageShell>
  );
}

export function CmsSkeleton() {
  return <div className="h-64 animate-pulse rounded-2xl border border-border-subtle bg-white" aria-label="جارٍ التحميل" />;
}

export function StatusBadge({ tone, children }: { tone: "green" | "orange" | "gray" | "red"; children: ReactNode }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    orange: "bg-amber-50 text-amber-800 ring-amber-200",
    gray: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    red: "bg-red-50 text-red-700 ring-red-200",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", styles[tone])}>{children}</span>;
}

export const formatCmsDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "—";

export const prettyJson = (value: unknown) => JSON.stringify(value ?? {}, null, 2);

export function parseJson(value: string, label: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error(`${label} يجب أن يكون كائن JSON.`);
  }
  return parsed as Record<string, unknown>;
}

"use client";

import { Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarNavItems } from "@/data";

import { useUserSession } from "@/lib/utils/user-session";
import { roleLabels } from "@/components/panel/users/results/user-result-parts";
import type { Country } from "@/types";
import CountryBadge from "./country-badge";

type SidebarTopbarProps = {
  onOpenMobileSidebar: () => void;
  country: Country | null;
  onSwitchCountry: () => void;
};

function SidebarTopbar({ onOpenMobileSidebar, country, onSwitchCountry }: SidebarTopbarProps) {
  const user = useUserSession();
  const pathname = usePathname();
  const currentPage = sidebarNavItems.filter((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))).sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:pr-20 lg:px-6 lg:pr-72">
        <nav aria-label="مسار الصفحة" className="flex min-w-0 items-center gap-2 text-sm">
          <Link href="/" className="shrink-0 font-medium text-text-muted hover:text-secondary">لوحة التحكم</Link>
          {pathname !== "/" && currentPage && <><span aria-hidden="true" className="text-gray/50">/</span><span aria-current="page" className="truncate font-semibold text-secondary">{currentPage.label}</span></>}
        </nav>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <CountryBadge country={country} onSwitch={onSwitchCountry} />
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="shrink-0 rounded-md border border-neutral-300 p-2 text-secondary transition hover:bg-neutral-100 md:hidden"
            aria-label="فتح القائمة"
          >
            <Menu size={20} className="shrink-0" />
          </button>

          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-200 text-neutral-600">
              <User size={16} className="shrink-0" />
            </div>
            <div className="hidden min-w-0 leading-tight sm:block">
              <p className="min-w-0 truncate text-xs font-bold text-secondary">
                {user?.name || "admin"}
              </p>
              <p className="text-[10px] font-semibold text-emerald-600">
                {user?.role ? roleLabels[user.role] : "مدير النظام"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SidebarTopbar;

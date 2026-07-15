"use client";

import { Menu, User } from "lucide-react";

import { useUserSession } from "@/lib/utils/user-session";
import { roleLabels } from "@/components/panel/users/results/user-result-parts";

type SidebarTopbarProps = {
  onOpenMobileSidebar: () => void;
};

function SidebarTopbar({ onOpenMobileSidebar }: SidebarTopbarProps) {
  const user = useUserSession();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:pr-20 lg:px-6 lg:pr-72">
        <h1 className="min-w-0 truncate text-sm font-extrabold text-secondary sm:text-base md:text-lg lg:text-2xl">
          لوحة التحكم الرئيسية
        </h1>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="shrink-0 rounded-md border border-neutral-300 p-2 text-secondary transition hover:bg-neutral-100 md:hidden"
            aria-label="فتح القائمة"
          >
            <Menu size={20} />
          </button>

          <div className="flex min-w-0 items-center gap-2">
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

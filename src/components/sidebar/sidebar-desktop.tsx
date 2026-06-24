import type { MouseEvent } from "react";

import SidebarBrand from "./sidebar-brand";
import SidebarNav from "./sidebar-nav";

type SidebarDesktopProps = {
  pathname: string;
  onDashboardClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onLogout: () => void;
};

function SidebarDesktop({
  pathname,
  onDashboardClick,
  onLogout,
}: SidebarDesktopProps) {
  return (
    <aside className="fixed inset-y-0 right-0 z-50 hidden w-64 border-l border-neutral-200 bg-white text-secondary lg:flex lg:flex-col">
      <div className="flex h-16 items-center justify-center border-b border-neutral-200 bg-primary px-4">
        <SidebarBrand />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-hidden py-4">
        <p className="mb-2 px-6 text-right text-[11px] font-medium text-gray/80">
          القائمة الرئيسية
        </p>
        <SidebarNav
          pathname={pathname}
          onDashboardClick={onDashboardClick}
          onLogout={onLogout}
        />
      </nav>
    </aside>
  );
}

export default SidebarDesktop;

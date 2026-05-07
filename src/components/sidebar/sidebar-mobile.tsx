import { X } from "lucide-react";
import type { MouseEvent } from "react";

import SidebarBrand from "./sidebar-brand";
import SidebarNav from "./sidebar-nav";

type SidebarMobileProps = {
  open: boolean;
  pathname: string;
  onClose: () => void;
  onDashboardClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onLogout: () => void;
};

function SidebarMobile({
  open,
  pathname,
  onClose,
  onDashboardClick,
  onLogout,
}: SidebarMobileProps) {
  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 flex w-[84%] max-w-72 flex-col bg-white text-secondary shadow-xl transition-transform duration-300 md:hidden ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 bg-primary px-4">
        <SidebarBrand />
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-secondary transition hover:bg-black/5"
          aria-label="إغلاق القائمة"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col px-3 py-4">
        <p className="mb-2 px-3 text-right text-[11px] font-medium text-gray/80">
          القائمة الرئيسية
        </p>
        <SidebarNav
          pathname={pathname}
          onDashboardClick={onDashboardClick}
          onLogout={onLogout}
          onNavigate={onClose}
        />
      </nav>
    </aside>
  );
}

export default SidebarMobile;

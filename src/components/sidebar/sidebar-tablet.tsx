import { X } from "lucide-react";
import type { MouseEvent } from "react";

import SidebarBrand from "./sidebar-brand";
import SidebarNav from "./sidebar-nav";

type SidebarTabletProps = {
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
  onDashboardClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onLogout: () => void;
};

function SidebarTablet({
  pathname,
  expanded,
  onToggle,
  onClose,
  onDashboardClick,
  onLogout,
}: SidebarTabletProps) {
  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 hidden border-l border-neutral-200 bg-white text-secondary transition-all duration-300 md:flex md:flex-col lg:hidden ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-neutral-200 bg-primary ${
          expanded ? "justify-between px-4" : "justify-center px-3"
        }`}
      >
        {expanded ? (
          <>
            <SidebarBrand />
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-secondary transition hover:bg-black/5"
              aria-label="إغلاق القائمة"
            >
              <X size={22} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-xl font-black text-secondary"
            aria-label="فتح القائمة"
          >
            <SidebarBrand compact />
          </button>
        )}
      </div>

      <nav
        className={`flex min-h-0 flex-1 flex-col gap-3 overflow-hidden py-4 ${
          expanded ? "" : "items-center"
        }`}
      >
        <SidebarNav
          pathname={pathname}
          collapsed={!expanded}
          expanded={expanded}
          linkSpacingClassName=""
          onDashboardClick={onDashboardClick}
          onLogout={onLogout}
        />
      </nav>
    </aside>
  );
}

export default SidebarTablet;

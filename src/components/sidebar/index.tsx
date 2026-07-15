"use client";

import { useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";

import { removeToken } from "@/lib";
import { clearUserSession } from "@/lib/utils/user-session";
import { logoutAPI } from "@/services/mutations";

import SidebarDesktop from "./sidebar-desktop";
import SidebarMobile from "./sidebar-mobile";
import SidebarOverlay from "./sidebar-overlay";
import SidebarTablet from "./sidebar-tablet";
import SidebarTopbar from "./sidebar-topbar";

function Sidebar() {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTabletSidebarExpanded, setIsTabletSidebarExpanded] = useState(false);

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const closeTabletSidebar = () => setIsTabletSidebarExpanded(false);

  const handleDashboardNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    window.location.assign("/");
  };

  const handleLogout = async () => {
    closeMobileSidebar();
    closeTabletSidebar();
    await logoutAPI();
    await removeToken();
    clearUserSession();
    window.location.assign("/login");
  };

  return (
    <>
      <SidebarTopbar
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      <SidebarDesktop
        pathname={pathname}
        onDashboardClick={handleDashboardNavigation}
        onLogout={handleLogout}
      />

      <SidebarTablet
        pathname={pathname}
        expanded={isTabletSidebarExpanded}
        onToggle={() => setIsTabletSidebarExpanded((current) => !current)}
        onClose={closeTabletSidebar}
        onDashboardClick={handleDashboardNavigation}
        onLogout={handleLogout}
      />

      <SidebarOverlay
        open={isTabletSidebarExpanded}
        onClick={closeTabletSidebar}
        className="fixed inset-0 z-30 hidden bg-black/35 transition-opacity duration-200 md:block lg:hidden"
      />

      <SidebarOverlay
        open={isMobileSidebarOpen}
        onClick={closeMobileSidebar}
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden"
      />

      <SidebarMobile
        open={isMobileSidebarOpen}
        pathname={pathname}
        onClose={closeMobileSidebar}
        onDashboardClick={handleDashboardNavigation}
        onLogout={handleLogout}
      />
    </>
  );
}

export default Sidebar;

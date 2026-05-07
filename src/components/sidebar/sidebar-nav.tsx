import type { MouseEvent } from "react";

import { sidebarNavItems } from "@/data";
import SidebarLogoutButton from "./sidebar-logout-button";
import SidebarNavLink from "./sidebar-nav-link";

type SidebarNavProps = {
  pathname: string;
  collapsed?: boolean;
  expanded?: boolean;
  linkSpacingClassName?: string;
  onDashboardClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onLogout: () => void;
  onNavigate?: () => void;
};

function SidebarNav({
  pathname,
  collapsed = false,
  expanded = true,
  linkSpacingClassName = "mt-2",
  onDashboardClick,
  onLogout,
  onNavigate,
}: SidebarNavProps) {
  return (
    <>
      {sidebarNavItems.map((item, index) => (
        <SidebarNavLink
          key={item.href}
          item={item}
          active={pathname === item.href}
          collapsed={collapsed}
          className={index === 0 || collapsed ? undefined : linkSpacingClassName}
          onDashboardClick={onDashboardClick}
          onNavigate={onNavigate}
        />
      ))}

      <SidebarLogoutButton
        collapsed={collapsed}
        expanded={expanded}
        onClick={onLogout}
      />
    </>
  );
}

export default SidebarNav;

import Link from "next/link";
import type { MouseEvent } from "react";

import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "@/data";

import {
  sidebarActiveLinkClass,
  sidebarInactiveLinkClass,
  sidebarLinkClass,
} from "./styles/sidebar.styles";

type SidebarNavLinkProps = {
  item: SidebarNavItem;
  active: boolean;
  collapsed?: boolean;
  className?: string;
  onDashboardClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onNavigate?: () => void;
};

function SidebarNavLink({
  item,
  active,
  collapsed = false,
  className,
  onDashboardClick,
  onNavigate,
}: SidebarNavLinkProps) {
  const Icon = item.icon;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (item.isDashboard) {
      onDashboardClick(event);
      return;
    }

    if (!active) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  };

  if (collapsed) {
    return (
      <Link
        href={item.href}
        onClick={handleClick}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
          active ? "bg-[#fff6c8] text-dark-gray" : sidebarInactiveLinkClass,
          className,
        )}
        aria-label={item.ariaLabel}
        aria-current={active ? "page" : undefined}
        title={item.label}
      >
        <Icon size={18} className="shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        sidebarLinkClass,
        active ? sidebarActiveLinkClass : sidebarInactiveLinkClass,
        className,
      )}
      aria-label={item.ariaLabel}
      aria-current={active ? "page" : undefined}
    >
      <Icon size={18} className="shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export default SidebarNavLink;

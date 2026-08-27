"use client";

import { ChevronDown } from "lucide-react";
import { useState, type MouseEvent } from "react";

import type { SidebarNavGroup, SidebarNavItem } from "@/data";
import { cn } from "@/lib/utils";

import SidebarNavLink from "./sidebar-nav-link";
import {
  sidebarActiveLinkClass,
  sidebarInactiveLinkClass,
  sidebarLinkClass,
} from "./styles/sidebar.styles";

type SidebarNavGroupProps = {
  group: SidebarNavGroup;
  items: SidebarNavItem[];
  activeHref?: string;
  className?: string;
  onDashboardClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onNavigate?: () => void;
};

function SidebarNavGroup({
  group,
  items,
  activeHref,
  className,
  onDashboardClick,
  onNavigate,
}: SidebarNavGroupProps) {
  const containsActiveItem = items.some((item) => item.href === activeHref);
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const open = containsActiveItem || manuallyOpen;
  const Icon = group.icon;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setManuallyOpen((current) => !current)}
        className={cn(
          sidebarLinkClass,
          containsActiveItem
            ? sidebarActiveLinkClass
            : sidebarInactiveLinkClass,
        )}
        aria-label={group.ariaLabel}
        aria-expanded={open}
        aria-controls={`sidebar-group-${group.id}`}
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1">{group.label}</span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          id={`sidebar-group-${group.id}`}
          className="relative mr-5 mt-1 flex flex-col gap-1 border-r border-neutral-200 pr-3"
        >
          {items.map((item) => (
            <SidebarNavLink
              key={item.href}
              item={item}
              active={item.href === activeHref}
              className="py-2.5"
              onDashboardClick={onDashboardClick}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SidebarNavGroup;

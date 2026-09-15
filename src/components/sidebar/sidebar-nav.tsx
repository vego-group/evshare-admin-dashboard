import { useState, type MouseEvent } from "react";
import { Search, X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarNavGroups, sidebarNavItems } from "@/data";
import { useUserPermissions } from "@/hooks";
import SidebarLogoutButton from "./sidebar-logout-button";
import SidebarNavGroup from "./sidebar-nav-group";
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
  const { hasAnyPermission } = useUserPermissions();
  const [search, setSearch] = useState("");
  const visibleNavItems = sidebarNavItems.filter(
    (item) => !item.permission || hasAnyPermission(item.permission),
  );
  const activeHref = visibleNavItems
    .filter(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
    )
    .sort((first, second) => second.href.length - first.href.length)[0]?.href;
  const standaloneItems = visibleNavItems.filter((item) => !item.group);
  const visibleGroups = sidebarNavGroups
    .map((group) => ({
      group,
      items: visibleNavItems.filter((item) => item.group === group.id),
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!collapsed && (
        <div className="px-3 pb-3" dir="rtl">
          <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-subtle px-3">
            <Search className="size-4 shrink-0 text-gray" aria-hidden="true" />
            <input
              type="search"
              aria-label="البحث في صفحات لوحة التحكم"
              placeholder="ابحث عن صفحة..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Escape") setSearch(""); }}
              className="h-10 min-w-0 w-full bg-transparent text-sm outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {search && <button type="button" aria-label="مسح البحث" onClick={() => setSearch("")} className="grid size-8 shrink-0 place-items-center rounded-lg text-gray hover:bg-white"><X className="size-4" /></button>}
          </div>
        </div>
      )}
      <ScrollArea
        type="auto"
        className={`min-h-0 flex-1 ${
          collapsed
            ? "**:data-[slot=scroll-area-scrollbar]:hidden"
            : "**:data-[slot=scroll-area-scrollbar]:left-0 **:data-[slot=scroll-area-scrollbar]:right-auto **:data-[slot=scroll-area-scrollbar]:w-1.5 **:data-[slot=scroll-area-thumb]:bg-neutral-300/80"
        }`}
      >
        <div
          dir="rtl"
          className={`flex flex-col pb-3 ${
            collapsed ? "items-center" : "items-stretch px-3"
          }`}
        >
          {!collapsed && search.trim() ? (
            <div className="flex flex-col gap-1">
              {visibleNavItems.filter((item) => item.label.includes(search.trim())).map((item) => (
                <SidebarNavLink key={item.href} item={item} active={item.href === activeHref} onDashboardClick={onDashboardClick} onNavigate={onNavigate} />
              ))}
              {!visibleNavItems.some((item) => item.label.includes(search.trim())) && <p role="status" className="px-3 py-8 text-center text-sm leading-6 text-text-muted">لا توجد صفحات مطابقة. جرّب كلمة أخرى.</p>}
            </div>
          ) : <>
          {standaloneItems.map((item, index) => (
            <SidebarNavLink
              key={item.href}
              item={item}
              active={item.href === activeHref}
              collapsed={collapsed}
              className={
                index === 0 || collapsed ? undefined : linkSpacingClassName
              }
              onDashboardClick={onDashboardClick}
              onNavigate={onNavigate}
            />
          ))}
          {collapsed
            ? visibleGroups.flatMap(({ items }) =>
                items.map((item) => (
                  <SidebarNavLink
                    key={item.href}
                    item={item}
                    active={item.href === activeHref}
                    collapsed
                    className="mt-2"
                    onDashboardClick={onDashboardClick}
                    onNavigate={onNavigate}
                  />
                )),
              )
            : visibleGroups.map(({ group, items }) => (
                <SidebarNavGroup
                  key={group.id}
                  group={group}
                  items={items}
                  activeHref={activeHref}
                  className={linkSpacingClassName}
                  onDashboardClick={onDashboardClick}
                  onNavigate={onNavigate}
                />
              ))}
          </>}
        </div>
      </ScrollArea>

      <div
        dir="rtl"
        className={`shrink-0 border-t border-neutral-100 pt-3 ${
          collapsed ? "flex justify-center" : "px-3"
        }`}
      >
        <SidebarLogoutButton
          collapsed={collapsed}
          expanded={expanded}
          onClick={onLogout}
        />
      </div>
    </div>
  );
}

export default SidebarNav;

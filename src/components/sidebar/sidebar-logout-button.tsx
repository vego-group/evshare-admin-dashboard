import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

import { sidebarLogoutClass } from "./styles/sidebar.styles";

type SidebarLogoutButtonProps = {
  collapsed?: boolean;
  expanded?: boolean;
  onClick: () => void;
};

function SidebarLogoutButton({
  collapsed = false,
  expanded = true,
  onClick,
}: SidebarLogoutButtonProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="mt-auto flex h-10 w-10 items-center justify-center rounded-md bg-rose-50 text-rose-500 transition hover:bg-rose-100"
        aria-label="تسجيل الخروج"
      >
        <LogOut size={18} className="shrink-0" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        expanded
          ? "mt-auto flex h-10 w-full items-center gap-2 rounded-md bg-rose-50 px-3 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-100"
          : sidebarLogoutClass,
        !expanded && "w-full",
      )}
    >
      <LogOut size={18} className="shrink-0" />
      <span>تسجيل الخروج</span>
    </button>
  );
}

export default SidebarLogoutButton;

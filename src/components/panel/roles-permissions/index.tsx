"use client";

import { useState } from "react";
import { FolderKey, KeyRound, ShieldCheck } from "lucide-react";
import Header from "@/components/ui/header";
import { cn } from "@/lib/utils";
import PermissionCategoriesPanel from "./categories/permission-categories-panel";
import PermissionsPanel from "./permissions/permissions-panel";
import RolesPanel from "./roles/roles-panel";

type Section = "roles" | "permissions" | "categories";
const sections = [
  { value: "roles" as const, label: "الأدوار", icon: ShieldCheck },
  { value: "permissions" as const, label: "الصلاحيات", icon: KeyRound },
  { value: "categories" as const, label: "تصنيفات الصلاحيات", icon: FolderKey },
];

export default function RolesPermissions() {
  const [section, setSection] = useState<Section>("roles");
  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="الأدوار والصلاحيات" subtitle="إدارة الوصول إلى لوحة التحكم من مكان واحد" />
      <nav className="flex flex-col gap-2 rounded-2xl border border-neutral-100/80 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:w-fit sm:flex-row">
        {sections.map(({ value, label, icon: Icon }) => (
          <button key={value} type="button" onClick={() => setSection(value)} className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-medium transition",
            section === value ? "bg-primary text-secondary shadow-sm" : "text-dark-gray hover:bg-primary/8",
          )}>
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </nav>
      {section === "roles" && <RolesPanel />}
      {section === "permissions" && <PermissionsPanel />}
      {section === "categories" && <PermissionCategoriesPanel />}
    </div>
  );
}

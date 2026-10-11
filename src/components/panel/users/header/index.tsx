import Header from "@/components/ui/header";
import ExportListButton from "@/components/ui/export-list-button";
import { ADMIN_PERMISSIONS } from "@/constants";
import { buildUsersQuery } from "@/services/queries/users";
import type { UsersQueryParams } from "@/types";

export type UsersViewMode = "table" | "card";

function UsersHeader({ params }: { params: UsersQueryParams }) {
  return (
    <section className="flex w-full items-center justify-between">
      <Header title="المستخدمون" subtitle="إدارة ومتابعة حسابات المستخدمين" />
      <ExportListButton permission={ADMIN_PERMISSIONS.users.export} path="users"
        query={buildUsersQuery(params)} fallbackFileName="users.xlsx" />
    </section>
  );
}

export default UsersHeader;

import { AlertCircle, RefreshCw } from "lucide-react";

import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { UserListItem } from "@/types";

import type { UsersViewMode } from "../header";
import UsersCards from "./users-cards";
import UsersTable from "./users-table";

type UsersResultsProps = {
  users: UserListItem[];
  viewMode: UsersViewMode;
  onDeleteUser: (user: UserListItem) => void;
  onEditUser: (user: UserListItem) => void;
  onSuspendUser: (user: UserListItem) => void;
  onReactivateUser: (user: UserListItem) => void;
  roleNames: Record<string, string>;
  isError?: boolean;
  isRetrying?: boolean;
  onRetry: () => void;
};

function UsersResults({ users, viewMode, onDeleteUser, onEditUser, onSuspendUser, onReactivateUser, roleNames, isError, isRetrying, onRetry }: UsersResultsProps) {
  if (isError) {
    return (
      <section
        role="alert"
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 px-5 py-8 text-center"
      >
        <AlertCircle className="size-8 text-rose-600" aria-hidden="true" />
        <div>
          <h2 className="font-semibold text-rose-800">تعذر تحميل المستخدمين</h2>
          <p className="mt-1 text-sm text-rose-700">تحقق من الاتصال ثم حاول مرة أخرى.</p>
        </div>
        <Button type="button" variant="outline" onClick={onRetry} disabled={isRetrying}>
          <RefreshCw className={isRetrying ? "size-4 animate-spin" : "size-4"} aria-hidden="true" />
          {isRetrying ? "جارٍ إعادة المحاولة..." : "إعادة المحاولة"}
        </Button>
      </section>
    );
  }

  if (!users.length) {
    return <EmptyState description="لا يوجد مستخدمون مطابقون." />;
  }

  const props = { users, onDeleteUser, onEditUser, onSuspendUser, onReactivateUser, roleNames };

  return viewMode === "table" ? <UsersTable {...props} /> : <UsersCards {...props} />;
}

export default UsersResults;

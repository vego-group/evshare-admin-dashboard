import EmptyState from "@/components/ui/empty-state";
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
};

function UsersResults({ users, viewMode, onDeleteUser, onEditUser, onSuspendUser, onReactivateUser, roleNames }: UsersResultsProps) {
  if (!users.length) {
    return <EmptyState description="لا يوجد مستخدمون مطابقون." />;
  }

  const props = { users, onDeleteUser, onEditUser, onSuspendUser, onReactivateUser, roleNames };

  return viewMode === "table" ? <UsersTable {...props} /> : <UsersCards {...props} />;
}

export default UsersResults;

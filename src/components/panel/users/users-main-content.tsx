import type { UserListItem, UsersListResponse, UsersQueryParams } from "@/types";

import type { UsersViewMode } from "./header";
import UsersPagination from "./pagination";
import UsersResults from "./results";
import UsersToolbar from "./toolbar";

type UsersMainContentProps = {
  data?: UsersListResponse;
  params: UsersQueryParams;
  viewMode: UsersViewMode;
  onParamsChange: (params: Partial<UsersQueryParams>) => void;
  onDeleteUser: (user: UserListItem) => void;
  onEditUser: (user: UserListItem) => void;
  onSuspendUser: (user: UserListItem) => void;
  onReactivateUser: (user: UserListItem) => void;
};

function UsersMainContent({
  data,
  params,
  viewMode,
  onParamsChange,
  onDeleteUser,
  onEditUser,
  onSuspendUser,
  onReactivateUser,
}: UsersMainContentProps) {
  return (
    <>
      <UsersToolbar
        searchQuery={params.search ?? ""}
        selectedRole={params.role}
        selectedStatus={params.account_status}
        selectedSort={params.order_by ?? "desc"}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onRoleChange={(role) => onParamsChange({ role, page: 1 })}
        onStatusChange={(account_status) => onParamsChange({ account_status, page: 1 })}
        onSortChange={(order_by) => onParamsChange({ order_by, page: 1 })}
      />
      <UsersResults
        users={data?.data ?? []}
        viewMode={viewMode}
        onDeleteUser={onDeleteUser}
        onEditUser={onEditUser}
        onSuspendUser={onSuspendUser}
        onReactivateUser={onReactivateUser}
      />
      <UsersPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default UsersMainContent;

import type { UserListItem, UserRoleSummary, UsersListResponse, UsersQueryParams } from "@/types";

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
  roles?: UserRoleSummary[];
  onViewModeChange: (viewMode: UsersViewMode) => void;
  onAddUser: () => void;
  roleNames: Record<string, string>;
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
  roles,
  onViewModeChange,
  onAddUser,
  roleNames,
}: UsersMainContentProps) {
  return (
    <>
      <UsersToolbar
        searchQuery={params.search ?? ""}
        selectedRole={params.role}
        selectedStatus={params.status}
        selectedSubscriptionStatus={params.subscription_status}
        selectedSort={params.sort_order ?? "desc"}
        roles={roles}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onAddUser={onAddUser}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onRoleChange={(role) => onParamsChange({ role, subscription_status: undefined, page: 1 })}
        onStatusChange={(status) => onParamsChange({ status, page: 1 })}
        onSubscriptionStatusChange={(subscription_status) => onParamsChange({ subscription_status, page: 1 })}
        onSortChange={(sort_order) => onParamsChange({ sort_order, page: 1 })}
      />
      <UsersResults
        users={data?.data ?? []}
        viewMode={viewMode}
        roleNames={roleNames}
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

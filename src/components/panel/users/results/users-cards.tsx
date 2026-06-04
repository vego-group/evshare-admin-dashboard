import type { UserListItem } from "@/types";

import {
  DetailLine,
  formatDate,
  getUserDisplayName,
  RoleBadge,
  UserActions,
  UserIcon,
  VerifiedBadge,
} from "./user-result-parts";

type UsersCardsProps = {
  users: UserListItem[];
  onDeleteUser: (user: UserListItem) => void;
};

function UsersCards({ users, onDeleteUser }: UsersCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <article
          key={user.id}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <UserIcon className="size-16" />
            <div className="min-w-0 flex-1 text-right">
              <h3 className="truncate text-lg font-semibold text-secondary">
                {getUserDisplayName(user)}
              </h3>
              {user.email && (
                <p className="truncate text-sm text-gray">{user.email}</p>
              )}
            </div>
            <div className="shrink-0">
              <RoleBadge role={user.role} />
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine label="الجوال" value={user.mobile} />
            <DetailLine label="التحقق" value={user.mobile_verified ? "موثّق" : "غير موثّق"} />
            <DetailLine label="تاريخ الإنشاء" value={formatDate(user.created_at)} />
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <UserActions compact onDelete={() => onDeleteUser(user)} />
          </div>
        </article>
      ))}
    </section>
  );
}

export default UsersCards;

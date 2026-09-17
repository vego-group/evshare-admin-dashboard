"use client";

import type { UserListItem } from "@/types";
import { useRouter } from "next/navigation";

import { formatStoredPhone } from "@/lib/utils/format-phone";
import { useTenantCountry } from "@/provider/currency";
import {
  AccountStatusBadge,
  DetailLine,
  formatDate,
  getUserDisplayName,
  RoleBadge,
  UserActions,
  UserIcon,
} from "./user-result-parts";

type UsersCardsProps = {
  users: UserListItem[];
  onDeleteUser: (user: UserListItem) => void;
  onEditUser: (user: UserListItem) => void;
  onSuspendUser: (user: UserListItem) => void;
  onReactivateUser: (user: UserListItem) => void;
};

function UsersCards({ users, onDeleteUser, onEditUser, onSuspendUser, onReactivateUser }: UsersCardsProps) {
  const router = useRouter();
  const countryCode = useTenantCountry();

  const openUser = (userId: string) => router.push(`/users/${userId}`);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <article
          key={user.id}
          role="button"
          tabIndex={0}
          onClick={() => openUser(user.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openUser(user.id);
            }
          }}
          className="cursor-pointer overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              <div className="flex flex-col gap-2"><RoleBadge role={user.role} /><AccountStatusBadge status={user.account_status} /></div>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine label="الجوال" value={formatStoredPhone(user.mobile, countryCode)} dir="ltr" />
            <DetailLine label="التحقق" value={user.mobile_verified ? "موثّق" : "غير موثّق"} />
            <DetailLine label="تاريخ الإنشاء" value={formatDate(user.created_at)} />
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <UserActions compact user={user} onEdit={() => onEditUser(user)} onSuspend={() => onSuspendUser(user)} onReactivate={() => onReactivateUser(user)} onDelete={() => onDeleteUser(user)} />
          </div>
        </article>
      ))}
    </section>
  );
}

export default UsersCards;

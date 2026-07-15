"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { UserListItem } from "@/types";

import {
  formatDate,
  getUserDisplayName,
  RoleBadge,
  UserActions,
  UserIcon,
  VerifiedBadge,
} from "./user-result-parts";

type UsersTableProps = {
  users: UserListItem[];
  onDeleteUser: (user: UserListItem) => void;
};

function UsersTable({ users, onDeleteUser }: UsersTableProps) {
  const router = useRouter();

  const openUser = (userId: string) => router.push(`/users/${userId}`);

  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>المستخدم</HeaderCell>
              <HeaderCell>الجوال</HeaderCell>
              <HeaderCell>الدور</HeaderCell>
              <HeaderCell>التحقق</HeaderCell>
              <HeaderCell>تاريخ الإنشاء</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                tabIndex={0}
                role="button"
                onClick={() => openUser(user.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openUser(user.id);
                  }
                }}
                className="cursor-pointer text-dark-gray transition hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
              >
                <TableCell>
                  <div className="flex max-w-60 items-center gap-3">
                    <UserIcon />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-base font-medium"
                        title={getUserDisplayName(user)}
                      >
                        {getUserDisplayName(user)}
                      </p>
                      {user.email && (
                        <p
                          className="truncate text-xs text-gray"
                          title={user.email}
                        >
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell dir="ltr">{formatSaudiPhoneNumber(user.mobile)}</TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <VerifiedBadge verified={user.mobile_verified} />
                </TableCell>
                <TableCell dir="ltr">{formatDate(user.created_at)}</TableCell>
                <TableCell truncate={false}>
                  <UserActions onDelete={() => onDeleteUser(user)} />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function TableCell({
  children,
  dir,
  truncate = true,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  truncate?: boolean;
}) {
  return (
    <td
      dir={dir}
      className={
        truncate
          ? "max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3"
          : "border-b border-primary/15 px-5 py-3"
      }
    >
      {children}
    </td>
  );
}

export default UsersTable;

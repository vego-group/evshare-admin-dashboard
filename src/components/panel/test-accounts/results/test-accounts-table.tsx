import type { ReactNode } from "react";

import type { TestAccountListItem } from "@/types";

import { Amount, StatusBadge, TestAccountActions, TestAccountIcon } from "./test-account-result-parts";

type TestAccountsTableProps = {
  testAccounts: TestAccountListItem[];
  onEditTestAccount: (testAccount: TestAccountListItem) => void;
  onToggleActive: (testAccount: TestAccountListItem) => void;
  onDeleteTestAccount: (testAccount: TestAccountListItem) => void;
};

function TestAccountsTable({
  testAccounts,
  onEditTestAccount,
  onToggleActive,
  onDeleteTestAccount,
}: TestAccountsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>المستخدم</HeaderCell>
              <HeaderCell>مبلغ الاشتراك</HeaderCell>
              <HeaderCell>مبلغ الطلب</HeaderCell>
              <HeaderCell>رسوم الشحن</HeaderCell>
              <HeaderCell>نسبة الضريبة</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {testAccounts.map((testAccount) => (
              <tr key={testAccount.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-55 items-center gap-3">
                    <TestAccountIcon />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium" title={testAccount.user.name}>
                        {testAccount.user.name}
                      </p>
                      <p className="truncate text-sm text-gray" dir="ltr">
                        {testAccount.user.mobile}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell dir="ltr">
                  <Amount value={testAccount.subscription_amount} />
                </TableCell>
                <TableCell dir="ltr">
                  <Amount value={testAccount.order_amount} />
                </TableCell>
                <TableCell dir="ltr">
                  <Amount value={testAccount.shipping_fee} />
                </TableCell>
                <TableCell dir="ltr">{testAccount.vat_percentage}%</TableCell>
                <TableCell truncate={false}>
                  <StatusBadge isActive={testAccount.is_active} />
                </TableCell>
                <TableCell truncate={false}>
                  <TestAccountActions
                    isActive={testAccount.is_active}
                    onEdit={() => onEditTestAccount(testAccount)}
                    onToggleActive={() => onToggleActive(testAccount)}
                    onDelete={() => onDeleteTestAccount(testAccount)}
                  />
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

export default TestAccountsTable;

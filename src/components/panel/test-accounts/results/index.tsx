import EmptyState from "@/components/ui/empty-state";
import type { TestAccountListItem } from "@/types";

import TestAccountsTable from "./test-accounts-table";

type TestAccountsResultsProps = {
  testAccounts: TestAccountListItem[];
  onViewTestAccount: (testAccount: TestAccountListItem) => void;
  onEditTestAccount: (testAccount: TestAccountListItem) => void;
  onToggleActive: (testAccount: TestAccountListItem) => void;
  onDeleteTestAccount: (testAccount: TestAccountListItem) => void;
};

function TestAccountsResults({
  testAccounts,
  onViewTestAccount,
  onEditTestAccount,
  onToggleActive,
  onDeleteTestAccount,
}: TestAccountsResultsProps) {
  if (!testAccounts.length) {
    return <EmptyState description="لا توجد حسابات اختبار مطابقة." />;
  }

  return (
    <TestAccountsTable
      testAccounts={testAccounts}
      onViewTestAccount={onViewTestAccount}
      onEditTestAccount={onEditTestAccount}
      onToggleActive={onToggleActive}
      onDeleteTestAccount={onDeleteTestAccount}
    />
  );
}

export default TestAccountsResults;

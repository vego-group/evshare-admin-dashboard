import type { TestAccountListItem, TestAccountsListResponse, TestAccountsQueryParams } from "@/types";

import TestAccountsPagination from "./pagination";
import TestAccountsResults from "./results";
import TestAccountsToolbar from "./toolbar";

type TestAccountsMainContentProps = {
  data?: TestAccountsListResponse;
  params: TestAccountsQueryParams;
  onParamsChange: (params: Partial<TestAccountsQueryParams>) => void;
  onViewTestAccount: (testAccount: TestAccountListItem) => void;
  onEditTestAccount: (testAccount: TestAccountListItem) => void;
  onToggleActive: (testAccount: TestAccountListItem) => void;
  onDeleteTestAccount: (testAccount: TestAccountListItem) => void;
};

function TestAccountsMainContent({
  data,
  params,
  onParamsChange,
  onViewTestAccount,
  onEditTestAccount,
  onToggleActive,
  onDeleteTestAccount,
}: TestAccountsMainContentProps) {
  return (
    <>
      <TestAccountsToolbar
        searchQuery={params.search ?? ""}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
      />
      <TestAccountsResults
        testAccounts={data?.data ?? []}
        onViewTestAccount={onViewTestAccount}
        onEditTestAccount={onEditTestAccount}
        onToggleActive={onToggleActive}
        onDeleteTestAccount={onDeleteTestAccount}
      />
      <TestAccountsPagination meta={data?.meta} onPageChange={(page) => onParamsChange({ page })} />
    </>
  );
}

export default TestAccountsMainContent;

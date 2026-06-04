import EmptyState from "@/components/ui/empty-state";
import type { WalletTransaction } from "@/types";

import type { WalletViewMode } from "../header";
import WalletTable from "../table";
import WalletCards from "./wallet-cards";

type WalletResultsProps = {
  transactions: WalletTransaction[];
  viewMode: WalletViewMode;
};

function WalletResults({ transactions, viewMode }: WalletResultsProps) {
  if (!transactions.length) {
    return <EmptyState description="لا توجد معاملات." />;
  }

  return viewMode === "table" ? (
    <WalletTable transactions={transactions} />
  ) : (
    <WalletCards transactions={transactions} />
  );
}

export default WalletResults;

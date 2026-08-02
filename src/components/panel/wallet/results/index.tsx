import EmptyState from "@/components/ui/empty-state";
import type { WalletTransaction } from "@/types";

import type { WalletViewMode } from "../header";
import WalletTable from "../table";
import WalletCards from "./wallet-cards";

type WalletResultsProps = {
  transactions: WalletTransaction[];
  viewMode: WalletViewMode;
  onViewTransaction: (transaction: WalletTransaction) => void;
};

function WalletResults({
  transactions,
  viewMode,
  onViewTransaction,
}: WalletResultsProps) {
  if (!transactions.length) {
    return <EmptyState description="لا توجد معاملات." />;
  }

  return viewMode === "table" ? (
    <WalletTable
      transactions={transactions}
      onViewTransaction={onViewTransaction}
    />
  ) : (
    <WalletCards
      transactions={transactions}
      onViewTransaction={onViewTransaction}
    />
  );
}

export default WalletResults;

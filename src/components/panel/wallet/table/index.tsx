import type { WalletTransaction } from "@/types";

import WalletTableHeader from "./wallet-table-header";
import WalletTableRow from "./wallet-table-row";

function WalletTable({ transactions }: { transactions: WalletTransaction[] }) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-277.5 border-separate border-spacing-0 text-right">
          <WalletTableHeader />
          <tbody>
            {transactions.map((transaction) => (
              <WalletTableRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default WalletTable;

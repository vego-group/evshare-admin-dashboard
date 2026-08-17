import type { VatRecord } from "@/types";

import VatTableHeader from "./vat-table-header";
import VatTableRow from "./vat-table-row";

function VatTable({ records }: { records: VatRecord[] }) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-300 border-separate border-spacing-0 text-right">
          <VatTableHeader />
          <tbody>
            {records.map((record) => (
              <VatTableRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default VatTable;

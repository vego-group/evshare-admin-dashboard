const tableHeaders = [
  "رقم الطلب",
  "اسم التاجر",
  "اسم المنتج",
  "السعر",
  "النوع",
  "الحالة",
  "التاريخ",
  "الإجراءات",
] as const;

function ProductOrdersTableHeader() {
  return (
    <thead>
      <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
        {tableHeaders.map((header) => (
          <th
            key={header}
            scope="col"
            className="border-b border-primary/15 px-5 py-5 text-right whitespace-nowrap"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default ProductOrdersTableHeader;

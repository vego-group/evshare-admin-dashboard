import { Eye, KeyRound, Pencil, Trash2 } from "lucide-react";
import TableAction from "./table-action";
import EntityTableShimmer from "./entity-table-shimmer";
import EmptyState from "@/components/ui/empty-state";

export type TableColumn<T> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
};

type Props<T extends { id: string }> = {
  rows: T[];
  columns: TableColumn<T>[];
  isLoading: boolean;
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onPermissions?: (item: T) => void;
};

export default function EntityTable<T extends { id: string }>(props: Props<T>) {
  if (props.isLoading) {
    return <EntityTableShimmer columns={props.columns.length + 1} />;
  }
  if (!props.rows.length) {
    return <EmptyState className="min-h-[420px]" />;
  }
  return (
    <div className="overflow-x-auto rounded-lg bg-white">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-right text-sm">
        <thead>
          <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
            {props.columns.map((column) => <th key={column.key} className="border-b border-primary/15 px-5 py-5">{column.label}</th>)}
            <th className="border-b border-primary/15 px-5 py-5">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr key={row.id} className="text-dark-gray transition hover:bg-neutral-50/70">
              {props.columns.map((column) => <td key={column.key} className="border-b border-primary/15 px-5 py-3.5">{column.render(row)}</td>)}
              <td className="border-b border-primary/15 px-5 py-3">
                <div className="flex gap-1">
                  <TableAction icon={<Eye />} label="عرض" onClick={() => props.onView(row)} />
                  {props.onPermissions && <TableAction permission icon={<KeyRound />} label="الصلاحيات" onClick={() => props.onPermissions!(row)} />}
                  <TableAction icon={<Pencil />} label="تعديل" onClick={() => props.onEdit(row)} />
                  <TableAction destructive icon={<Trash2 />} label="حذف" onClick={() => props.onDelete(row)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

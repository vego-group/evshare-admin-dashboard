import { Eye, KeyRound, Pencil, Trash2 } from "lucide-react";
import TableAction from "./table-action";
import EntityTableShimmer from "./entity-table-shimmer";
import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export type TableColumn<T> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  width?: string;
};

type Props<T extends { id: string }> = {
  rows: T[];
  columns: TableColumn<T>[];
  isLoading: boolean;
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onPermissions?: (item: T) => void;
  canEdit?: (item: T) => boolean;
  canDelete?: (item: T) => boolean;
  tableClassName?: string;
  actionsClassName?: string;
  actionsWidth?: string;
};

export default function EntityTable<T extends { id: string }>(props: Props<T>) {
  if (props.isLoading) {
    return <EntityTableShimmer columns={props.columns.length + 1} />;
  }
  if (!props.rows.length) {
    return <EmptyState className="min-h-[420px]" />;
  }
  const defaultColumnWidth = `${100 / (props.columns.length + 1)}%`;
  return (
    <div className="overflow-x-auto rounded-lg bg-white">
      <table
        className={cn(
          "w-full min-w-[760px] table-fixed border-separate border-spacing-0 text-right text-sm",
          props.tableClassName,
        )}
      >
        <colgroup>
          {props.columns.map((column) => (
            <col key={column.key} style={{ width: column.width ?? defaultColumnWidth }} />
          ))}
          <col style={{ width: props.actionsWidth ?? defaultColumnWidth }} />
        </colgroup>
        <thead>
          <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
            {props.columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "border-b border-primary/15 px-5 py-5",
                  column.headerClassName,
                )}
              >
                {column.label}
              </th>
            ))}
            <th
              className={cn(
                "border-b border-primary/15 px-5 py-5",
                props.actionsClassName,
              )}
            >
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr
              key={row.id}
              className="text-dark-gray transition hover:bg-neutral-50/70"
            >
              {props.columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "border-b border-primary/15 px-5 py-3.5",
                    column.className,
                  )}
                >
                  {column.render(row)}
                </td>
              ))}
              <td
                className={cn(
                  "border-b border-primary/15 px-5 py-3",
                  props.actionsClassName,
                )}
              >
                <div className="flex gap-1">
                  <TableAction
                    icon={<Eye />}
                    label="عرض"
                    onClick={() => props.onView(row)}
                  />
                  {props.onPermissions && (
                    <TableAction
                      permission
                      icon={<KeyRound />}
                      label="الصلاحيات"
                      onClick={() => props.onPermissions!(row)}
                    />
                  )}
                  {props.canEdit?.(row) !== false && (
                    <TableAction
                      icon={<Pencil />}
                      label="تعديل"
                      onClick={() => props.onEdit(row)}
                    />
                  )}
                  {props.canDelete?.(row) !== false && (
                    <TableAction
                      destructive
                      icon={<Trash2 />}
                      label="حذف"
                      onClick={() => props.onDelete(row)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

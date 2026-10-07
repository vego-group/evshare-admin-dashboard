import { BellRing, ChevronLeft, ChevronRight, MessageSquareText, Store, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { CommunicationListItem, CommunicationsListResponse } from "@/types";

import { CommunicationStatusBadge, formatCommunicationDate } from "./utils";

type Props = {
  items: CommunicationListItem[];
  meta?: CommunicationsListResponse["meta"];
  isFetching?: boolean;
  canShowDetails: boolean;
  onSelect: (id: string) => void;
  onPageChange: (page: number) => void;
};

export default function CommunicationsHistory({ items, meta, isFetching, canShowDetails, onSelect, onPageChange }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <div className={cn("overflow-x-auto transition-opacity", isFetching && "opacity-60")}>
        <table className="w-full min-w-[900px] text-right text-sm">
          <thead className="bg-primary/8 text-secondary"><tr><Th>الرسالة</Th><Th>القنوات</Th><Th>التطبيقات</Th><Th>الحالة</Th><Th>أنشأها</Th><Th>تاريخ الإنشاء</Th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => (
              <tr key={item.id} tabIndex={canShowDetails ? 0 : undefined} role={canShowDetails ? "button" : undefined} onClick={() => canShowDetails && onSelect(item.id)} onKeyDown={(event) => { if (canShowDetails && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(item.id); } }} className={cn("text-dark-gray", canShowDetails && "cursor-pointer hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none")}>
                <Td><span className="block max-w-72 truncate font-semibold text-secondary" title={item.title ?? undefined}>{item.title || "رسالة نصية بدون عنوان"}</span><span dir="ltr" className="mt-1 block max-w-48 truncate text-xs text-gray">{item.id}</span></Td>
                <Td><div className="flex gap-1.5">{item.channels.includes("push") ? <IconPill label="Push" icon={BellRing} /> : null}{item.channels.includes("sms") ? <IconPill label="SMS" icon={MessageSquareText} /> : null}</div></Td>
                <Td><div className="flex gap-1.5">{item.target_apps.includes("merchant") ? <IconPill label="التاجر" icon={Store} /> : null}{item.target_apps.includes("rider") ? <IconPill label="السائق" icon={Truck} /> : null}</div></Td>
                <Td><CommunicationStatusBadge status={item.status} /></Td>
                <Td>{item.created_by?.name || "—"}</Td>
                <Td dir="ltr" className="text-right">{formatCommunicationDate(item.created_at)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!items.length ? <EmptyState description="لا توجد رسائل تطابق عوامل التصفية الحالية." /> : null}
      {meta && meta.lastPage > 1 ? (
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 text-sm text-gray sm:flex-row">
          <span>عرض {(meta.currentPage - 1) * meta.perPage + 1}–{Math.min(meta.currentPage * meta.perPage, meta.total)} من {meta.total}</span>
          <div dir="ltr" className="flex items-center gap-2"><Button variant="outline" size="icon-sm" aria-label="الصفحة السابقة" disabled={isFetching || meta.currentPage <= 1} onClick={() => onPageChange(meta.currentPage - 1)}><ChevronLeft /></Button><span className="min-w-20 text-center">{meta.currentPage} / {meta.lastPage}</span><Button variant="outline" size="icon-sm" aria-label="الصفحة التالية" disabled={isFetching || meta.currentPage >= meta.lastPage} onClick={() => onPageChange(meta.currentPage + 1)}><ChevronRight /></Button></div>
        </footer>
      ) : null}
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) { return <th className="whitespace-nowrap px-4 py-4 font-semibold">{children}</th>; }
function Td({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td {...props} className={cn("whitespace-nowrap px-4 py-4", props.className)}>{children}</td>; }
function IconPill({ label, icon: Icon }: { label: string; icon: typeof BellRing }) { return <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-2 py-1 text-xs"><Icon className="size-3.5" />{label}</span>; }

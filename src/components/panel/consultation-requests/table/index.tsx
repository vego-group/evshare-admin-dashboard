"use client";

import {
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import {
  consultationRequests,
  consultationRequestStatuses,
} from "@/data";
import type {
  ConsultationRequest,
  ConsultationRequestStatus,
  ConsultationRequestType,
} from "@/types";

function ConsultationRequestsTable({
  requests = consultationRequests,
  onViewRequest,
  onStatusChange,
}: {
  requests?: ConsultationRequest[];
  onViewRequest?: (request: ConsultationRequest) => void;
  onStatusChange?: (
    requestId: string,
    status: ConsultationRequestStatus,
  ) => void;
}) {
  return (
    <section className="space-y-4 md:space-y-0 md:overflow-hidden md:rounded-lg md:bg-white">
      <div className="space-y-4 md:hidden">
        {requests.map((request) => (
          <MobileRequestCard
            key={request.id}
            request={request}
            onViewRequest={onViewRequest}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1024px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
              <TableHead className="w-[211px]">الاسم</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead className="w-[250px]">البريد الإلكتروني</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الإجراءات</TableHead>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="text-base font-medium text-dark-gray"
              >
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>
                  <StatusSelect
                    status={request.status}
                    onChange={(status) => onStatusChange?.(request.id, status)}
                  />
                </TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <ActionButton
                      icon={Eye}
                      label="عرض طلب الاستشارة"
                      className="bg-blue-50 text-blue-600"
                      onClick={() => onViewRequest?.(request)}
                    />
                    <ActionButton
                      icon={Pencil}
                      label="تعديل طلب الاستشارة"
                      className="bg-amber-50 text-orange-500"
                    />
                    <ActionButton
                      icon={Trash2}
                      label="حذف طلب الاستشارة"
                      className="bg-red-50 text-red-500"
                    />
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!requests.length ? (
        <EmptyState description="لم نتمكن من العثور على طلبات استشارة جرب تعديل معايير البحث" />
      ) : null}
    </section>
  );
}

function MobileRequestCard({
  request,
  onViewRequest,
  onStatusChange,
}: {
  request: ConsultationRequest;
  onViewRequest?: (request: ConsultationRequest) => void;
  onStatusChange?: (
    requestId: string,
    status: ConsultationRequestStatus,
  ) => void;
}) {
  return (
    <article>
      <div className="rounded-2xl border border-primary/15 bg-white p-4 text-right text-sm font-medium text-dark-gray">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-secondary">
              {request.name}
            </h3>
            <p className="mt-1 text-xs text-gray">{request.date}</p>
          </div>
          <StatusSelect
            status={request.status}
            onChange={(status) => onStatusChange?.(request.id, status)}
          />
        </div>

        <div className="mt-4 grid gap-3">
          <InfoRow label="الهاتف" value={request.phone} />
          <InfoRow label="البريد الإلكتروني" value={request.email} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 px-1">
        <ActionButton
          icon={Eye}
          label="عرض طلب الاستشارة"
          className="bg-blue-50 text-blue-600"
          onClick={() => onViewRequest?.(request)}
        />
        <ActionButton
          icon={Pencil}
          label="تعديل طلب الاستشارة"
          className="bg-amber-50 text-orange-500"
        />
        <ActionButton
          icon={Trash2}
          label="حذف طلب الاستشارة"
          className="bg-red-50 text-red-500"
        />
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-gray">{label}</span>
      <span className="min-w-0 truncate text-left">{value}</span>
    </div>
  );
}

function TableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("border-b border-primary/15 px-5 py-5", className)}>
      {children}
    </th>
  );
}

function TableCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("h-16 border-b border-primary/15 px-5 py-3", className)}>
      {children}
    </td>
  );
}

function TypeBadge({ type }: { type: ConsultationRequestType }) {
  const className = {
    مبيعات: "bg-blue-50 text-blue-600",
    تقني: "bg-purple-50 text-purple-600",
    دعم: "bg-amber-50 text-amber-600",
    عام: "bg-gray-100 text-dark-gray",
  }[type];

  return (
    <span
      className={cn(
        "inline-flex h-[38px] min-w-16 items-center justify-center rounded-full px-4 text-sm",
        className,
      )}
    >
      {type}
    </span>
  );
}

function StatusSelect({
  status,
  onChange,
}: {
  status: ConsultationRequestStatus;
  onChange?: (status: ConsultationRequestStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const config = {
    جديد: "bg-green-50 text-green",
    مغلق: "bg-gray-100 text-dark-gray",
    "تم التواصل": "bg-amber-50 text-amber-600",
  }[status];

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-label="تحديث حالة طلب الاستشارة"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "inline-flex h-[38px] min-w-[98px] items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition hover:brightness-95",
          config,
          isOpen && "brightness-95",
        )}
      >
        {status}
        <ChevronDown
          className={cn("size-4 transition", isOpen && "rotate-180")}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-max min-w-full overflow-hidden rounded-b-[14px] border border-primary bg-bg-warm-ivory text-right shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {consultationRequestStatuses.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange?.(option);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-[50px] w-full items-center justify-start whitespace-nowrap px-4 text-base font-medium text-secondary transition hover:bg-primary/10",
                status === option && "bg-primary/10",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  className,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  className: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-11 place-items-center rounded-lg transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

export default ConsultationRequestsTable;

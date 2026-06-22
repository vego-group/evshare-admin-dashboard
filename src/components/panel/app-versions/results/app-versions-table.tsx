import type { ReactNode } from "react";

import EmptyState from "@/components/ui/empty-state";
import type { AppVersionListItem } from "@/types";

import {
  AppVersionActions,
  CriticalBadge,
  formatDate,
  formatPlatform,
  StatusBadge,
} from "./app-version-result-parts";

type AppVersionsTableProps = {
  appVersions: AppVersionListItem[];
  onViewAppVersion: (appVersion: AppVersionListItem) => void;
  onEditAppVersion: (appVersion: AppVersionListItem) => void;
  onDeleteAppVersion: (appVersion: AppVersionListItem) => void;
};

function AppVersionsTable({
  appVersions,
  onViewAppVersion,
  onEditAppVersion,
  onDeleteAppVersion,
}: AppVersionsTableProps) {
  if (!appVersions.length) {
    return (
      <EmptyState
        title="لا توجد إصدارات تطبيقات"
        description="لم يتم العثور على إصدارات مطابقة، جرب تعديل البحث أو الفلاتر"
        className="min-h-[360px] rounded-lg"
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>المنصة</HeaderCell>
              <HeaderCell>الإصدار</HeaderCell>
              <HeaderCell>رمز الإصدار</HeaderCell>
              <HeaderCell>التحديث الحرج</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>تاريخ الإضافة</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {appVersions.map((appVersion) => (
              <tr key={appVersion.id} className="text-dark-gray">
                <TableCell>{formatPlatform(appVersion.platform)}</TableCell>
                <TableCell dir="ltr">{appVersion.version}</TableCell>
                <TableCell dir="ltr">{appVersion.version_code}</TableCell>
                <TableCell>
                  <CriticalBadge isCritical={appVersion.is_critical} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={appVersion.status} />
                </TableCell>
                <TableCell dir="ltr">{formatDate(appVersion.created_at)}</TableCell>
                <TableCell>
                  <AppVersionActions
                    onView={() => onViewAppVersion(appVersion)}
                    onEdit={() => onEditAppVersion(appVersion)}
                    onDelete={() => onDeleteAppVersion(appVersion)}
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function TableCell({
  children,
  dir,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <td dir={dir} className="border-b border-primary/15 px-5 py-3">
      {children}
    </td>
  );
}

export default AppVersionsTable;

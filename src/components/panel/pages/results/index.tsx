import { Pencil } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import EmptyState from "@/components/ui/empty-state";
import { getPageLabel } from "@/data/pages";
import type { Page } from "@/types";

import PageActionButton from "./action-button";

type Props = {
  pages: Page[];
  onEdit: (page: Page) => void;
};

function PagesResults({ pages, onEdit }: Props) {
  if (!pages.length) {
    return (
      <EmptyState
        title="لا توجد صفحات"
        description="لم يتم العثور على أي صفحات."
        className="min-h-90 rounded-2xl bg-white"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-212.5 text-right">
        <thead className="bg-primary/8 text-dark-gray">
          <tr>
            <th className="px-5 py-4">الصفحة</th>
            <th className="px-5 py-4">العنوان بالعربية</th>
            <th className="px-5 py-4">العنوان بالإنجليزية</th>
            <th className="px-5 py-4">آخر تحديث</th>
            <th className="px-5 py-4">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.uuid} className="border-b border-primary/15 last:border-0">
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                {getPageLabel(page.slug)}
              </td>
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                {page.title_ar}
              </td>
              <td
                dir="ltr"
                className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 text-right"
              >
                {page.title_en}
              </td>
              <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4">
                {new Date(page.updated_at).toLocaleDateString("ar-EG")}
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <PermissionGate slug="Admin Edit Pages">
                    <PageActionButton label="تعديل" onClick={() => onEdit(page)}>
                      <Pencil className="size-4" />
                    </PageActionButton>
                  </PermissionGate>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PagesResults;

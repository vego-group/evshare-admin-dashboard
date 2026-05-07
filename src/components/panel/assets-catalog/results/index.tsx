import { Eye, MapPin, Pencil, Trash2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AssetItem, AssetStatus, AssetType, AssetsCatalogViewMode } from "@/types";
import AssetsCatalogEmptyState from "./assets-catalog-empty-state";
function TypeBadge({ type }: { type: AssetType }) {
  const className = {
    سكوتر: "bg-blue-50 text-blue-700",
    دراجة: "bg-purple-50 text-purple-700",
    شاحن: "bg-amber-50 text-amber-700",
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

function StatusBadge({ status }: { status: AssetStatus }) {
  const config = {
    نشط: {
      className: "bg-green-50 text-green-600",
      dotClassName: "bg-green-500",
    },
    "غير نشط": {
      className: "bg-gray-100 text-dark-gray",
      dotClassName: "bg-gray-400",
    },
    متعطل: {
      className: "bg-red-50 text-red-600",
      dotClassName: "bg-red-500",
    },
  }[status];

  return (
    <span
      className={cn(
        "inline-flex h-[38px] w-fit min-w-[88px] items-center justify-center gap-2 rounded-full px-4 text-sm whitespace-nowrap",
        config.className,
      )}
    >
      <span className={cn("size-2 rounded-full", config.dotClassName)} />
      {status}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  className,
  label,
  onClick,
}: {
  icon: LucideIcon;
  className: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-10 place-items-center rounded-lg transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

function AssetActions({
  compact = false,
  onView,
  onEdit,
  onDelete,
}: {
  compact?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full")}>
      <ActionButton
        icon={Eye}
        onClick={onView}
        label="عرض الأصل"
        className={cn("bg-blue-50 text-blue-600", compact && "flex-1")}
      />
      <ActionButton
        icon={Pencil}
        onClick={onEdit}
        label="تعديل الأصل"
        className={cn("bg-amber-50 text-orange-500", compact && "flex-1")}
      />
      <ActionButton
        icon={Trash2}
        onClick={onDelete}
        label="حذف الأصل"
        className={cn("bg-red-50 text-red-500", compact && "flex-1")}
      />
    </div>
  );
}

function AssetsTable({
  assets,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
}: {
  assets: AssetItem[];
  onViewAsset: (asset: AssetItem) => void;
  onEditAsset: (asset: AssetItem) => void;
  onDeleteAsset: (asset: AssetItem) => void;
}) {
  if (!assets.length) return <AssetsCatalogEmptyState />;

  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <th className="border-b border-primary/15 px-5 py-5">
                اسم الأصل
              </th>
              <th className="border-b border-primary/15 px-4 py-5">النوع</th>
              <th className="border-b border-primary/15 px-4 py-5">الحالة</th>
              <th className="border-b border-primary/15 px-5 py-5">الموقع</th>
              <th className="border-b border-primary/15 px-5 py-5">السعر</th>
              <th className="border-b border-primary/15 px-5 py-5">
                آخر تحديث
              </th>
              <th className="border-b border-primary/15 px-5 py-5">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="text-dark-gray">
                <td className="border-b border-primary/15 px-5 py-3">
                  <div className="space-y-1">
                    <p className="text-base font-medium">{asset.name}</p>
                    <p className="text-xs font-medium text-gray/70">
                      {asset.id}
                    </p>
                  </div>
                </td>
                <td className="border-b border-primary/15 px-4 py-3">
                  <TypeBadge type={asset.type} />
                </td>
                <td className="border-b border-primary/15 px-4 py-3">
                  <StatusBadge status={asset.status} />
                </td>
                <td className="border-b border-primary/15 px-5 py-3">
                  <span className="inline-flex items-center gap-2 text-base font-medium">
                    <MapPin className="size-4 text-gray/70" />
                    {asset.location}
                  </span>
                </td>
                <td className="border-b border-primary/15 px-5 py-3 text-base font-medium">
                  {asset.price}
                </td>
                <td className="border-b border-primary/15 px-5 py-3 text-base font-medium">
                  {asset.updatedAt}
                </td>
                <td className="border-b border-primary/15 px-5 py-3">
                  <AssetActions
                    onView={() => onViewAsset(asset)}
                    onEdit={() => onEditAsset(asset)}
                    onDelete={() => onDeleteAsset(asset)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AssetsCards({
  assets,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
}: {
  assets: AssetItem[];
  onViewAsset: (asset: AssetItem) => void;
  onEditAsset: (asset: AssetItem) => void;
  onDeleteAsset: (asset: AssetItem) => void;
}) {
  if (!assets.length) return <AssetsCatalogEmptyState />;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {assets.map((asset) => (
        <article
          key={asset.id}
          className="rounded-2xl border border-neutral-100 bg-white p-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1 text-right">
              <h3 className="truncate text-base font-normal leading-6 text-[#101828]">
                {asset.name}
              </h3>
              <p className="text-sm leading-5 text-gray">{asset.id}</p>
            </div>
            <TypeBadge type={asset.type} />
          </div>

          <div className="mt-4 flex flex-col gap-2 text-right">
            <StatusBadge status={asset.status} />
            <p className="inline-flex items-center gap-2 text-sm text-dark-gray">
              <MapPin className="size-3.5 text-gray/70" />
              {asset.location}
            </p>
            <p className="text-xs text-gray">{asset.updatedAt}</p>
          </div>

          <div className="mt-4 flex items-center justify-between text-dark-gray">
            <p className="text-sm font-medium">السعر</p>
            <p className="text-base font-semibold">{asset.price}</p>
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <AssetActions
              compact
              onView={() => onViewAsset(asset)}
              onEdit={() => onEditAsset(asset)}
              onDelete={() => onDeleteAsset(asset)}
            />
          </div>
        </article>
      ))}
    </section>
  );
}

function AssetsCatalogResults({
  assets,
  viewMode,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
}: {
  assets: AssetItem[];
  viewMode: AssetsCatalogViewMode;
  onViewAsset: (asset: AssetItem) => void;
  onEditAsset: (asset: AssetItem) => void;
  onDeleteAsset: (asset: AssetItem) => void;
}) {
  return viewMode === "table" ? (
    <AssetsTable
      assets={assets}
      onViewAsset={onViewAsset}
      onEditAsset={onEditAsset}
      onDeleteAsset={onDeleteAsset}
    />
  ) : (
    <AssetsCards
      assets={assets}
      onViewAsset={onViewAsset}
      onEditAsset={onEditAsset}
      onDeleteAsset={onDeleteAsset}
    />
  );
}

export default AssetsCatalogResults;


import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  className?: string;
};

function EmptyState({
  title = "لا توجد نتائج مطابقة",
  description = "لم نتمكن من العثور على نتائج، جرب تعديل معايير البحث",
  imageUrl = "/images/empty-state.gif",
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "flex min-h-130 items-center justify-center overflow-hidden rounded-2xl bg-white px-6 py-12",
        className,
      )}
    >
      <div className="flex w-full max-w-75 flex-col items-center gap-4 text-center">
        <div className="relative h-57.25 w-full overflow-hidden">
          <div
            className="absolute left-0 top-[-21%] h-[131%] w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-hidden="true"
          />
        </div>

        <div className="flex w-55.25 flex-col items-center gap-2">
          <h2 className="text-2xl font-medium leading-8 text-secondary">
            {title}
          </h2>
          <p className="text-sm font-medium leading-5 text-[#9da4ae]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmptyState;

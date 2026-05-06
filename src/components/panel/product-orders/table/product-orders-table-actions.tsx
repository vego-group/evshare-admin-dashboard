import { Eye } from "lucide-react";

function ProductOrdersTableActions({ onView }: { onView: () => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="عرض الطلب"
        onClick={onView}
        className="grid size-11 place-items-center rounded-lg bg-blue/10 text-blue transition hover:bg-blue/15"
      >
        <Eye className="size-5" />
      </button>
    </div>
  );
}

export default ProductOrdersTableActions;

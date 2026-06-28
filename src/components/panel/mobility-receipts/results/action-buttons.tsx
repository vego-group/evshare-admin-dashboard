import { CheckCircle2, Eye, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  compact?: boolean;
  onView: () => void;
  onEditTemplate: () => void;
  onReview: () => void;
};

function MobilityReceiptActions({ compact, onView, onEditTemplate, onReview }: Props) {
  return (
    <div className={compact ? "flex gap-1" : "flex flex-wrap gap-2"}>
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon-sm" : "sm"}
        onClick={onView}
        title="عرض التفاصيل"
      >
        <Eye className="size-4" />
        {!compact && <span>عرض</span>}
      </Button>
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon-sm" : "sm"}
        onClick={onEditTemplate}
        title="رفع قالب العقد"
      >
        <FileUp className="size-4" />
        {!compact && <span>رفع القالب</span>}
      </Button>
      <Button
        type="button"
        size={compact ? "icon-sm" : "sm"}
        onClick={onReview}
        className="bg-primary text-secondary hover:bg-primary/90"
        title="مراجعة العقد"
      >
        <CheckCircle2 className="size-4" />
        {!compact && <span>مراجعة</span>}
      </Button>
    </div>
  );
}

export default MobilityReceiptActions;

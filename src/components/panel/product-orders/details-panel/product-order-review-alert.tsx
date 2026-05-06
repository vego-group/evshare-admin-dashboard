import { Info } from "lucide-react";

function ProductOrderReviewAlert() {
  return (
    <div className="flex h-[57px] items-center gap-3 rounded-[14px] border border-blue/20 bg-blue/8 px-4 text-right text-base leading-6 text-[#1c398e]">
      <Info className="size-5 shrink-0 text-blue" />
      <span>هذا طلب جديد يحتاج مراجعة</span>
    </div>
  );
}

export default ProductOrderReviewAlert;

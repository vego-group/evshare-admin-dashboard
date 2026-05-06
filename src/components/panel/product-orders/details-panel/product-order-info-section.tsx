import type { ProductOrder } from "@/types";

import DetailsPanelSectionTitle from "./details-panel-section-title";
import ProductOrderTypePill from "./product-order-type-pill";

function ProductOrderInfoSection({ order }: { order: ProductOrder }) {
  return (
    <section className="space-y-4">
      <DetailsPanelSectionTitle>معلومات المنتج</DetailsPanelSectionTitle>

      <div className="space-y-4 rounded-[14px] bg-[#f9fafb] p-5 text-right">
        <div className="space-y-1">
          <p className="text-sm leading-5 text-gray">اسم المنتج</p>
          <p className="text-lg font-medium leading-7 text-secondary">
            {order.productName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm leading-5 text-gray">الفئة</p>
            <ProductOrderTypePill type={order.type} />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm leading-5 text-gray">السعر</p>
            <p className="text-lg font-medium leading-7 text-secondary">
              {order.price} <span className="text-sm text-gray">ر.س</span>
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm leading-5 text-gray">الوصف</p>
          <p className="text-base leading-[26px] text-secondary">
            {order.productDescription}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProductOrderInfoSection;

import { Building2, Mail, Phone } from "lucide-react";

import type { ProductOrder } from "@/types";

import DetailsPanelSectionTitle from "./details-panel-section-title";
import ProductOrderMerchantRow from "./product-order-merchant-row";

function ProductOrderMerchantSection({ order }: { order: ProductOrder }) {
  return (
    <section className="space-y-4">
      <DetailsPanelSectionTitle>معلومات التاجر</DetailsPanelSectionTitle>

      <div className="space-y-3 rounded-[14px] bg-[#f9fafb] p-5">
        <ProductOrderMerchantRow
          icon={Building2}
          label="اسم المتجر"
          value={order.merchantName}
        />
        <ProductOrderMerchantRow
          icon={Phone}
          label="رقم الهاتف"
          value={order.merchantPhone}
          valueDir="ltr"
        />
        <ProductOrderMerchantRow
          icon={Mail}
          label="البريد الإلكتروني"
          value={order.merchantEmail}
        />
      </div>
    </section>
  );
}

export default ProductOrderMerchantSection;

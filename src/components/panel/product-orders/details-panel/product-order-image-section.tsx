import Image from "next/image";

import type { ProductOrder } from "@/types";

import DetailsPanelSectionTitle from "./details-panel-section-title";

function ProductOrderImageSection({ order }: { order: ProductOrder }) {
  return (
    <section className="space-y-4">
      <DetailsPanelSectionTitle>صور المنتج</DetailsPanelSectionTitle>
      <div className="flex">
        <div className="relative h-[203px] w-[220px] overflow-hidden rounded-[14px] bg-muted">
          <Image
            src={order.productImageSrc}
            alt={order.productName}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default ProductOrderImageSection;

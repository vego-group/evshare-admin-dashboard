import { productOrderStats } from "@/data";

import ProductOrdersStatCard from "./product-orders-stat-card";

function ProductOrdersStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {productOrderStats.map((stat) => (
        <ProductOrdersStatCard key={stat.label} stat={stat} />
      ))}
    </section>
  );
}

export default ProductOrdersStats;

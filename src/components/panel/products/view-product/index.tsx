"use client";

import { useParams } from "next/navigation";

import Header from "@/components/ui/header";
import { useProduct } from "@/hooks/api";

import { ProductDetailsContent } from "./product-details-content";

function ViewProduct() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProduct(id ?? null);

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="تفاصيل المنتج" subtitle="عرض بيانات المنتج المختار" />

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <ProductDetailsContent product={data?.data} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ViewProduct;

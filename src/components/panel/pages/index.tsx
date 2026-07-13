"use client";

import { useRouter } from "next/navigation";

import { usePages } from "@/hooks/api";

import PagesContentShimmer from "./content-shimmer";
import PagesHeader from "./header";
import PagesResults from "./results";

function Pages() {
  const router = useRouter();
  const { data, isLoading } = usePages();

  if (isLoading) {
    return <PagesContentShimmer />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <PagesHeader />
      <PagesResults
        pages={data?.data ?? []}
        onEdit={(page) => router.push(`/pages/${page.uuid}/edit`)}
      />
    </div>
  );
}

export default Pages;

"use client";

import { useRouter } from "next/navigation";

import { usePages } from "@/hooks/api";
import QueryErrorState from "@/components/ui/query-error-state";

import PagesContentShimmer from "./content-shimmer";
import PagesHeader from "./header";
import PagesResults from "./results";

function Pages() {
  const router = useRouter();
  const { data, isLoading, isError, isFetching, refetch } = usePages();

  if (isLoading) {
    return <PagesContentShimmer />;
  }

  if (isError) {
    return (
      <QueryErrorState
        title="تعذر تحميل الصفحات الثابتة"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
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

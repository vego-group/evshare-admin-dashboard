import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";

import type { ConsultationRequest } from "@/types";

type ConsultationStat = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  iconSrc: string;
  iconClassName: string;
};

function ConsultationRequestsStats({
  requests,
}: {
  requests: ConsultationRequest[];
}) {
  const consultationStats: ConsultationStat[] = [
    {
      label: "إجمالي الطلبات",
      value: String(requests.length),
      change: "12%",
      trend: "up",
      iconSrc: "/images/total-consultation-requests.svg",
      iconClassName: "bg-[#eff6ff]",
    },
    {
      label: "الطلبات الجديدة",
      value: String(
        requests.filter((request) => request.status === "جديد").length,
      ),
      change: "2%",
      trend: "down",
      iconSrc: "/images/new-consultation-requests.svg",
      iconClassName: "bg-primary/10",
    },
    {
      label: "الطلبات المغلقة",
      value: String(
        requests.filter((request) => request.status === "مغلق").length,
      ),
      change: "8%",
      trend: "up",
      iconSrc: "/images/closed-consultation-requests.svg",
      iconClassName: "bg-[#f9f5fa]",
    },
    {
      label: "تم التواصل",
      value: String(
        requests.filter((request) => request.status === "تم التواصل").length,
      ),
      change: "3%",
      trend: "down",
      iconSrc: "/images/completed-consultation-requests.svg",
      iconClassName: "bg-green/10",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {consultationStats.map((stat) => (
        <ConsultationStatCard key={stat.label} stat={stat} />
      ))}
    </section>
  );
}

function ConsultationStatCard({ stat }: { stat: ConsultationStat }) {
  const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
  const trendClassName = stat.trend === "up" ? "text-green" : "text-red";

  return (
    <article className="relative h-[177px] overflow-hidden rounded-2xl border border-neutral-100/80 bg-white p-6">
      <div className="pointer-events-none absolute -top-16 -right-16 size-32 rounded-full bg-primary/8 opacity-50" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`grid size-12 shrink-0 place-items-center rounded-[14px] ${stat.iconClassName}`}
          >
            <Image
              src={stat.iconSrc}
              alt=""
              width={24}
              height={24}
              className="size-6"
              unoptimized
            />
          </div>

          <span
            className={`inline-flex items-center gap-1 text-sm leading-5 ${trendClassName}`}
          >
            <TrendIcon className="size-4" strokeWidth={2} />
            {stat.change}
          </span>
        </div>

        <div className="text-right">
          <p className="text-[36px] font-normal leading-10 text-secondary">
            {stat.value}
          </p>
          <p className="mt-2 text-sm font-normal leading-5 text-dark-gray">
            {stat.label}
          </p>
        </div>
      </div>
    </article>
  );
}

export default ConsultationRequestsStats;

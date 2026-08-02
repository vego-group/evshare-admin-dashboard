import Image from "next/image";

import type { ConsultationAnalytics } from "@/types";

type ConsultationStat = {
  label: string;
  value: string;
  iconSrc: string;
  iconClassName: string;
};

function ConsultationRequestsStats({
  analytics,
}: {
  analytics?: ConsultationAnalytics;
}) {
  const consultationStats: ConsultationStat[] = [
    {
      label: "إجمالي الطلبات",
      value: String(analytics?.total ?? 0),
      iconSrc: "/images/total-consultation-requests.svg",
      iconClassName: "bg-[#eff6ff]",
    },
    {
      label: "قيد المراجعة",
      value: String(analytics?.pending ?? 0),
      iconSrc: "/images/new-consultation-requests.svg",
      iconClassName: "bg-primary/10",
    },
    {
      label: "الطلبات المغلقة",
      value: String(analytics?.closed ?? 0),
      iconSrc: "/images/closed-consultation-requests.svg",
      iconClassName: "bg-[#f9f5fa]",
    },
    {
      label: "تم التواصل",
      value: String(analytics?.reviewed ?? 0),
      iconSrc: "/images/completed-consultation-requests.svg",
      iconClassName: "bg-green/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {consultationStats.map((stat) => (
        <ConsultationStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function ConsultationStatCard({ stat }: { stat: ConsultationStat }) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="whitespace-nowrap text-sm font-normal leading-5 text-gray">
          {stat.label}
        </p>
        <p className="truncate text-2xl font-semibold leading-8 text-secondary">
          {stat.value}
        </p>
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${stat.iconClassName}`}
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
    </div>
  );
}

export default ConsultationRequestsStats;

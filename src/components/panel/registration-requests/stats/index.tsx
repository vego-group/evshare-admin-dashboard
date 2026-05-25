import { registrationRequestStats } from "@/data";
import type { KycAnalytics } from "@/types";

interface StatsCardsProps {
  data?: KycAnalytics;
}

export default function StatsCards({ data }: StatsCardsProps) {
  const cards = [
    {
      ...registrationRequestStats[3],
      value: data?.total ?? registrationRequestStats[3].value,
    },
    {
      ...registrationRequestStats[0],
      value: data?.approved ?? registrationRequestStats[0].value,
    },
    {
      ...registrationRequestStats[1],
      value: data?.pending ?? registrationRequestStats[1].value,
    },
    {
      ...registrationRequestStats[2],
      value: data?.rejected ?? registrationRequestStats[2].value,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-normal leading-5 text-gray whitespace-nowrap">
              {card.label}
            </p>
            <p className="text-2xl font-semibold leading-8 text-secondary">
              {card.value}
            </p>
          </div>
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${card.iconBg}`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

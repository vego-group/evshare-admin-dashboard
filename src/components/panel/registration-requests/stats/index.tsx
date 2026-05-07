import React from "react";

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
}

const CheckCircleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="#25935f"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
      stroke="#ffce27"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="#3b82f6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClipboardListIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      stroke="#3b82f6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const defaultStats: StatCard[] = [
  {
    label: "موافق عليها",
    value: 1,
    icon: <CheckCircleIcon />,
    iconBg: "bg-[#f0fdf4]",
  },
  {
    label: "قيد المراجعة",
    value: 2,
    icon: <ClockIcon />,
    iconBg: "bg-[#fefce8]",
  },
  {
    label: "طلبات جديدة",
    value: 3,
    icon: <AlertCircleIcon />,
    iconBg: "bg-[#eff6ff]",
  },
  {
    label: "إجمالي الطلبات",
    value: 7,
    icon: <ClipboardListIcon />,
    iconBg: "bg-[#eff6ff]",
  },
];

interface StatsCardsProps {
  data?: { approved?: number; pending?: number; new?: number; total?: number };
}

export default function StatsCards({ data }: StatsCardsProps) {
  const cards = [
    { ...defaultStats[0], value: data?.approved ?? defaultStats[0].value },
    { ...defaultStats[1], value: data?.pending ?? defaultStats[1].value },
    { ...defaultStats[2], value: data?.new ?? defaultStats[2].value },
    { ...defaultStats[3], value: data?.total ?? defaultStats[3].value },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
        >
          {/* Text */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-normal leading-5 text-gray whitespace-nowrap">
              {card.label}
            </p>
            <p className="text-2xl font-semibold leading-8 text-secondary">
              {card.value}
            </p>
          </div>
          {/* Icon */}
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

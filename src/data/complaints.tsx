import type { ComplaintStatConfig } from "@/types";

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

const StarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3l2.09 6.26H21l-5.47 3.97 2.09 6.26L12 15.52l-5.62 3.97 2.09-6.26L3 9.26h6.91L12 3z"
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
      stroke="#6366f1"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const complaintStatConfig: ComplaintStatConfig[] = [
  {
    label: "إجمالي الشكاوى",
    key: "total",
    icon: ClipboardListIcon,
    iconBg: "bg-[#eef2ff]",
  },
  {
    label: "جديدة",
    key: "new",
    icon: StarIcon,
    iconBg: "bg-[#eff6ff]",
  },
  {
    label: "قيد المعالجة",
    key: "in_progress",
    icon: ClockIcon,
    iconBg: "bg-[#fefce8]",
  },
  {
    label: "تم الرد",
    key: "answered",
    icon: CheckCircleIcon,
    iconBg: "bg-[#f0fdf4]",
  },
];

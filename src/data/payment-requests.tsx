import { PaymentRequestStatCard } from "@/types";

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

const XCircleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 9l-6 6m0-6l6 6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="#ef4444"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
      stroke="#3b82f6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const paymentRequestStats: PaymentRequestStatCard[] = [
  {
    label: "موافق عليها",
    value: 0,
    icon: <CheckCircleIcon />,
    iconBg: "bg-[#f0fdf4]",
  },
  {
    label: "قيد المراجعة",
    value: 0,
    icon: <ClockIcon />,
    iconBg: "bg-[#fefce8]",
  },
  {
    label: "مرفوضة",
    value: 0,
    icon: <XCircleIcon />,
    iconBg: "bg-red-50",
  },
  {
    label: "إجمالي الطلبات",
    value: 0,
    icon: <CurrencyIcon />,
    iconBg: "bg-[#eff6ff]",
  },
];

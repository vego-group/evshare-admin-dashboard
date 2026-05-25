import { RegistrationRequestStatCard } from "@/types";

export type RegistrationRequestStatus =
  | "موافق عليها"
  | "قيد المراجعة"
  | "مرفوضة";

export type RegistrationRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  documents: {
    completed: number;
    total: number;
  };
  status: RegistrationRequestStatus;
  date: string;
  alert: string;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  documentsList: {
    id: string;
    label: string;
    complete: boolean;
  }[];
};

export const registrationRequestStatuses: RegistrationRequestStatus[] = [
  "موافق عليها",
  "مرفوضة",
  "قيد المراجعة",
];

export const registrationRequests: RegistrationRequest[] = [
  {
    id: "RR-1001",
    name: "مايسة محمد بصراوي",
    phone: "583317251",
    email: "khalid.otaibi@example.com",
    documents: { completed: 4, total: 4 },
    status: "موافق عليها",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "أحمد محمد السالم",
      phone: "+966 50 123 4567",
      email: "ahmed@electronics.sa",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: true },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: true },
      { id: "owner-id", label: "هوية المالك", complete: true },
    ],
  },
  {
    id: "RR-1002",
    name: "مسفر حسين ال دبيان",
    phone: "535095068",
    email: "ahmed.salem@example.com",
    documents: { completed: 3, total: 4 },
    status: "مرفوضة",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "مسفر حسين ال دبيان",
      phone: "+966 53 509 5068",
      email: "ahmed.salem@example.com",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: true },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: true },
      { id: "owner-id", label: "هوية المالك", complete: false },
    ],
  },
  {
    id: "RR-1003",
    name: "إلهام محمود قاسم",
    phone: "536605363",
    email: "fatima.rashid@example.com",
    documents: { completed: 4, total: 4 },
    status: "قيد المراجعة",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "إلهام محمود قاسم",
      phone: "+966 53 660 5363",
      email: "fatima.rashid@example.com",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: true },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: true },
      { id: "owner-id", label: "هوية المالك", complete: true },
    ],
  },
  {
    id: "RR-1004",
    name: "محسن يحي الوادعي",
    phone: "501759844",
    email: "m.qahtani@example.com",
    documents: { completed: 4, total: 4 },
    status: "مرفوضة",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "محسن يحي الوادعي",
      phone: "+966 50 175 9844",
      email: "m.qahtani@example.com",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: true },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: true },
      { id: "owner-id", label: "هوية المالك", complete: true },
    ],
  },
  {
    id: "RR-1005",
    name: "مبخوت مبارك الهمامي",
    phone: "583674433",
    email: "sarah.dosari@example.com",
    documents: { completed: 3, total: 4 },
    status: "موافق عليها",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "مبخوت مبارك الهمامي",
      phone: "+966 58 367 4433",
      email: "sarah.dosari@example.com",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: true },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: false },
      { id: "owner-id", label: "هوية المالك", complete: true },
    ],
  },
  {
    id: "RR-1006",
    name: "صفاء جنيد باجنيد",
    phone: "533918767",
    email: "omar.harbi@example.com",
    documents: { completed: 3, total: 4 },
    status: "موافق عليها",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "صفاء جنيد باجنيد",
      phone: "+966 53 391 8767",
      email: "omar.harbi@example.com",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: false },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: true },
      { id: "owner-id", label: "هوية المالك", complete: true },
    ],
  },
  {
    id: "RR-1007",
    name: "ألفت محمد قباني",
    phone: "558441490",
    email: "layla.mutairi@example.com",
    documents: { completed: 4, total: 4 },
    status: "قيد المراجعة",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "ألفت محمد قباني",
      phone: "+966 55 844 1490",
      email: "layla.mutairi@example.com",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: true },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: true },
      { id: "owner-id", label: "هوية المالك", complete: true },
    ],
  },
  {
    id: "RR-1008",
    name: "أيمن بن ناصر الحارثي",
    phone: "593854454",
    email: "m.qahtani@example.com",
    documents: { completed: 4, total: 4 },
    status: "قيد المراجعة",
    date: "منذ 5 دقائق",
    alert: "هذا طلب جديد يحتاج مراجعة",
    owner: {
      name: "أيمن بن ناصر الحارثي",
      phone: "+966 59 385 4454",
      email: "m.qahtani@example.com",
    },
    documentsList: [
      { id: "commercial-record", label: "السجل التجاري", complete: true },
      { id: "tax-certificate", label: "الشهادة الضريبية", complete: true },
      { id: "bank-statement", label: "كشف حساب بنكي", complete: true },
      { id: "owner-id", label: "هوية المالك", complete: true },
    ],
  },
];

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

export const registrationRequestStats: RegistrationRequestStatCard[] = [
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
    icon: <ClipboardListIcon />,
    iconBg: "bg-[#eff6ff]",
  },
];

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

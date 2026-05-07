import type {
  ConsultationRequest,
  ConsultationRequestStatus,
  ConsultationRequestType,
} from "@/types";

export const consultationRequestTypes: ConsultationRequestType[] = [
  "مبيعات",
  "تقني",
  "دعم",
  "عام",
];

export const consultationRequestStatuses: ConsultationRequestStatus[] = [
  "جديد",
  "مغلق",
  "تم التواصل",
];

export const consultationRequests: ConsultationRequest[] = [
  {
    id: "CR-1001",
    name: "مايسة محمد بصراوي",
    phone: "583317251",
    email: "khalid.otaibi@example.com",
    type: "مبيعات",
    status: "جديد",
    date: "منذ 5 دقائق",
  },
  {
    id: "CR-1002",
    name: "مسفر حسين ال دبيان",
    phone: "535095068",
    email: "ahmed.salem@example.com",
    type: "تقني",
    status: "مغلق",
    date: "منذ 5 دقائق",
  },
  {
    id: "CR-1003",
    name: "إلهام محمود قاسم",
    phone: "536605363",
    email: "fatima.rashid@example.com",
    type: "دعم",
    status: "تم التواصل",
    date: "منذ 5 دقائق",
  },
  {
    id: "CR-1004",
    name: "محسن يحي الوادعي",
    phone: "501759844",
    email: "m.qahtani@example.com",
    type: "عام",
    status: "مغلق",
    date: "منذ 5 دقائق",
  },
  {
    id: "CR-1005",
    name: "مبخوت مبارك الهمامي",
    phone: "583674433",
    email: "sarah.dosari@example.com",
    type: "تقني",
    status: "جديد",
    date: "منذ 5 دقائق",
  },
  {
    id: "CR-1006",
    name: "صفاء جنيد باجنيد",
    phone: "533918767",
    email: "omar.harbi@example.com",
    type: "تقني",
    status: "جديد",
    date: "منذ 5 دقائق",
  },
  {
    id: "CR-1007",
    name: "ألفت محمد قباني",
    phone: "558441490",
    email: "layla.mutairi@example.com",
    type: "مبيعات",
    status: "تم التواصل",
    date: "منذ 5 دقائق",
  },
  {
    id: "CR-1008",
    name: "أيمن بن ناصر الحارثي",
    phone: "593854454",
    email: "m.qahtani@example.com",
    type: "دعم",
    status: "تم التواصل",
    date: "منذ 5 دقائق",
  },
];

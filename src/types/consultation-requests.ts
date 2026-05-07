export type ConsultationRequestType = "مبيعات" | "تقني" | "دعم" | "عام";

export type ConsultationRequestStatus = "جديد" | "مغلق" | "تم التواصل";

export type ConsultationRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: ConsultationRequestType;
  status: ConsultationRequestStatus;
  date: string;
};

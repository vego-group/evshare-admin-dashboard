import type {
  VehicleListItem,
  VehiclesPaginationMeta,
  VehiclesQueryParams,
} from "./vehicle-operating-pricing";

export type MobilityReceiptReviewStatus = "approved" | "rejected";

export type MobilityReceiptFile = {
  url: string;
  type: string;
  document_type: string | null;
  disk: string;
  created_at: string;
};

export type MobilityReceiptLocation = {
  id: string;
  longitude: string;
  latitude: string;
  address: string;
  label: string;
  created_at: string;
};

export type MobilityReceipt = VehicleListItem & {
  user_id: number | null;
  order_item_id: number | null;
  contract_template: MobilityReceiptFile[];
  location: MobilityReceiptLocation | null;
  zone: unknown;
};

export type MobilityReceiptQueryParams = VehiclesQueryParams;

export type MobilityReceiptAnalytics = {
  total_receipts: number;
  with_template: number;
  pending_review: number;
  rejected: number;
};

export type MobilityReceiptListResponse = {
  error: boolean;
  message: string;
  data: MobilityReceipt[];
  meta?: MobilityReceiptPaginationMeta;
  analytics?: MobilityReceiptAnalytics;
};

export type MobilityReceiptDetailsResponse = {
  error: boolean;
  message: string;
  data: MobilityReceipt;
};

export type MobilityReceiptPaginationMeta = VehiclesPaginationMeta;

export type UploadContractTemplatePayload = {
  contract_template?: File;
};

export type TestAccountUser = {
  id: string;
  name: string;
  mobile: string;
};

export type TestAccountsQueryParams = {
  page: number;
  limit: number;
  search?: string;
};

export type TestAccountListItem = {
  id: string;
  user: TestAccountUser;
  subscription_amount: number;
  order_amount: number;
  shipping_fee: number;
  vat_percentage: number;
  is_active: boolean;
  created_at: string;
};

export type TestAccountsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type TestAccountsListResponse = {
  error: boolean;
  message: string;
  data: TestAccountListItem[];
  meta: TestAccountsPaginationMeta;
};

export type TestAccountDetailResponse = {
  error: boolean;
  message: string;
  data: TestAccountListItem;
};

export type AddTestAccountPayload = {
  mobile?: string;
  user_uuid?: string;
  subscription_amount?: number;
  order_amount?: number;
  shipping_fee?: number;
  vat_percentage?: number;
  is_active?: boolean;
};

export type EditTestAccountPayload = {
  subscription_amount?: number;
  order_amount?: number;
  shipping_fee?: number;
  vat_percentage?: number;
};

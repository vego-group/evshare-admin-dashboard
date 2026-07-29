import { QueryParams } from ".";

export type OperatingCompaniesQueryParams = Pick<
  QueryParams,
  "page" | "limit" | "search"
>;

export type OperatingCompanyLogo = {
  id: string;
  url: string;
};

export type OperatingCompanyListItem = {
  id: string;
  operation_company_id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  name: string;
  commission_percentage: number | string | null;
  mobile: string | null;
  email: string | null;
  logo: OperatingCompanyLogo[];
  conditions_ar: string | null;
  conditions_en: string | null;
  conditions: string | null;
  created_at: string;
};

export type OperatingCompaniesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type OperatingCompaniesListResponse = {
  error: boolean;
  message: string;
  data: OperatingCompanyListItem[];
  meta?: OperatingCompaniesPaginationMeta;
};

export type OperatingCompanyDetailsResponse = {
  error: boolean;
  message: string;
  data: OperatingCompanyListItem;
};

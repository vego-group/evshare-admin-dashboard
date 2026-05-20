export type OrderBy = "asc" | "desc";

export type Status = "active" | "inactive";

export type QueryParams = {
  page: number;
  limit: number;
  status?: Status;
  order_by?: OrderBy;
  search?: string;
};

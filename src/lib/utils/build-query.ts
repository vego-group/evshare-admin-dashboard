import { QueryValue } from "@/types";

export const buildQuery = <TParams extends Record<string, QueryValue>>(
  params: TParams,
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  return query.toString();
};

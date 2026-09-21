import { AxiosRequestConfig } from "axios";

export type ExtraConfig = AxiosRequestConfig & { isForm?: boolean };
export type ErrorBody = {
  message?: string;
  code?: string;
  error_code?: string;
  details?: Record<string, unknown> | null;
  retry_after_seconds?: number;
  [key: string]: unknown;
};
export type ApiResult<
  T = unknown,
  E extends { message?: string } = ErrorBody,
> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: E;
  message: string;
  retryAfterSeconds?: number;
};

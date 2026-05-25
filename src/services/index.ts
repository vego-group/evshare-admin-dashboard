import axios, { AxiosError, AxiosInstance, Method } from "axios";
import { getToken } from "@/lib";
import { ApiResult, ErrorBody, ExtraConfig } from "@/types";
import { getPayloadMessage, getValidationErrors } from "@/lib/utils/helper";

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL,
});

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_BASE_URL,
});

const attach401Interceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        window.location.replace("/login");
      }
      return Promise.reject(error);
    },
  );
};

attach401Interceptor(adminApi);
attach401Interceptor(authApi);

export const initApi = async () => {
  const token = await getToken();
  if (token) {
    adminApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    authApi.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

const safe = async <T = unknown, E extends { message: string } = ErrorBody>(
  instance: AxiosInstance,
  method: Method,
  url: string,
  data?: unknown,
  config: ExtraConfig = {},
): Promise<ApiResult<T, E>> => {
  await initApi();
  const { isForm, headers, ...rest } = config;
  try {
    const res = await instance.request<T>({
      method,
      url,
      data,
      ...rest,
      headers: {
        "Content-Type": isForm ? "multipart/form-data" : "application/json",
        ...headers,
      },
    });
    const msg = (res.data as { message: string })?.message;
    return { ok: true, status: res.status, data: res.data, message: msg };
  } catch (err) {
    const e = err as AxiosError<E>;
    const payload = e.response?.data;
    const payloadMessage = getPayloadMessage(payload);
    const validationErrors = getValidationErrors(payload);
    const message =
      validationErrors.length > 0
        ? `${payloadMessage ?? e.message}: ${validationErrors.join(" ")}`
        : (payloadMessage ?? e.message);
    return {
      ok: false,
      status: e.response?.status ?? 500,
      error: payload,
      message,
    };
  }
};

export const safeApi = async <
  T = unknown,
  E extends { message: string } = ErrorBody,
>(
  method: Method,
  url: string,
  data?: unknown,
  config?: ExtraConfig,
) => await safe<T, E>(adminApi, method, url, data, config);

export const safeAuthApi = async <
  T = unknown,
  E extends { message: string } = ErrorBody,
>(
  method: Method,
  url: string,
  data?: unknown,
  config?: ExtraConfig,
) => await safe<T, E>(authApi, method, url, data, config);

export const baseAPI = async (method: Method, url: string) => {
  await initApi();
  const response = await adminApi.request({
    method,
    url,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

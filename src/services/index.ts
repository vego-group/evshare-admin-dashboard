import axios, { AxiosError, AxiosInstance, Method } from "axios";
import { ApiResult, ErrorBody, ExtraConfig } from "@/types";
import { getPayloadMessage, getValidationErrors } from "@/lib/utils/helper";
import { notifyForbidden, notifyOffline } from "@/lib/toast-events";
import { getRetryAfterSeconds } from "@/lib/utils/api-error";

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL,
  headers: { "Accept-Language": "ar" },
});

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_BASE_URL,
  headers: { "Accept-Language": "ar" },
});

let isRedirectingToLogin = false;

function redirectToExpiredLogin() {
  if (typeof window === "undefined" || isRedirectingToLogin) return;
  isRedirectingToLogin = true;
  try {
    window.localStorage.removeItem("user_data");
  } catch {
    // Navigation still clears the server-side token cookie via the proxy.
  }
  void fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "same-origin",
    keepalive: true,
  }).finally(() => window.location.replace("/login?expired=1"));
}

const attachAuthInterceptor = (instance: AxiosInstance, notifyOnForbidden: boolean) => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) redirectToExpiredLogin();
      if (notifyOnForbidden && error.response?.status === 403) {
        notifyForbidden(error.response.data);
      }
      return Promise.reject(error);
    },
  );
};

attachAuthInterceptor(adminApi, true);
attachAuthInterceptor(authApi, false);

export const initApi = async () => {
  if (typeof window !== "undefined") return {};

  const { getCountry, getToken } = await import("@/lib/utils/auth");
  const [token, country] = await Promise.all([getToken(), getCountry()]);
  return {
    ...(country ? { "X-Tenant-Id": country } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const safe = async <T = unknown, E extends { message?: string } = ErrorBody>(
  instance: AxiosInstance,
  method: Method,
  url: string,
  data?: unknown,
  config: ExtraConfig = {},
): Promise<ApiResult<T, E>> => {
  const requestHeaders = await initApi();
  const { isForm, headers, ...rest } = config;
  try {
    const res = await instance.request<T>({
      method,
      url,
      data,
      ...rest,
      headers: {
        "Content-Type": isForm ? "multipart/form-data" : "application/json",
        ...requestHeaders,
        ...headers,
      },
    });
    const msg = getPayloadMessage(res.data) ?? "";
    return { ok: true, status: res.status, data: res.data, message: msg };
  } catch (err) {
    const e = axios.isAxiosError<E>(err) ? err : null;
    if (
      typeof window === "undefined" &&
      instance === adminApi &&
      e?.response?.status === 401
    ) {
      const [{ removeToken }, { redirect }] = await Promise.all([
        import("@/lib/utils/auth"),
        import("next/navigation"),
      ]);
      await removeToken();
      redirect("/login?expired=1");
    }
    const payload = e?.response?.data;
    const payloadMessage = getPayloadMessage(payload);
    const validationErrors = getValidationErrors(payload);
    const fallbackMessage = err instanceof Error ? err.message : "Request failed";
    const message =
      validationErrors.length > 0
        ? `${payloadMessage ?? fallbackMessage}: ${validationErrors.join(" ")}`
        : (payloadMessage ?? fallbackMessage);
    return {
      ok: false,
      status: e?.response?.status ?? 500,
      error: payload,
      message,
      retryAfterSeconds:
        getRetryAfterSeconds(payload) ??
        getRetryAfterSeconds({ retry_after_seconds: e?.response?.headers?.["retry-after"] }),
    };
  }
};

export const safeApi = async <
  T = unknown,
  E extends { message?: string } = ErrorBody,
>(
  method: Method,
  url: string,
  data?: unknown,
  config?: ExtraConfig,
) => await safe<T, E>(adminApi, method, url, data, config);

export const safeAuthApi = async <
  T = unknown,
  E extends { message?: string } = ErrorBody,
>(
  method: Method,
  url: string,
  data?: unknown,
  config?: ExtraConfig,
) => await safe<T, E>(authApi, method, url, data, config);

export const baseAPI = async (method: Method, url: string) => {
  if (typeof window !== "undefined") {
    let response: Response;
    try {
      response = await fetch(`/api/admin${url}`, {
        method,
        headers: {
          Accept: "application/json",
        },
        credentials: "same-origin",
      });
    } catch (error) {
      if (!navigator.onLine) notifyOffline();
      throw error;
    }
    const contentType = response.headers.get("content-type");
    const configVersion = response.headers
      .get("X-Config-Version")
      ?.match(/(?:^|;)\s*feature_flags=(\d+)(?:;|$)/)?.[1];
    if (configVersion && !url.startsWith("/feature-flags/evaluations")) {
      window.dispatchEvent(new CustomEvent("feature-flags-config-version", {
        detail: Number(configVersion),
      }));
    }
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (response.status === 401) redirectToExpiredLogin();
    if (response.status === 403) notifyForbidden(data);

    if (!response.ok) {
      const message =
        typeof data === "object" && data && "message" in data
          ? String(data.message)
          : "Request failed";
      const error = new Error(message) as Error & { status: number };
      error.status = response.status;
      throw error;
    }

    return data;
  }

  const requestHeaders = await initApi();
  const response = await adminApi.request({
    method,
    url,
    headers: { "Content-Type": "application/json", ...requestHeaders },
  });
  return response.data;
};

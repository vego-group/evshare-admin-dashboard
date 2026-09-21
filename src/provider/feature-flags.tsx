"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { useEvaluatedFeatureFlags } from "@/hooks/api";
import {
  isFeatureEnabled,
  parseFeatureFlagEvaluation,
} from "@/lib/utils/feature-flags";
import { useUserSession } from "@/lib/utils/user-session";

const configuredBuildNumber = Number(
  process.env.NEXT_PUBLIC_APP_BUILD_NUMBER ?? "1",
);
const APPLICATION_BUILD_NUMBER =
  Number.isInteger(configuredBuildNumber) && configuredBuildNumber > 0
    ? configuredBuildNumber
    : 1;

type FeatureFlagsContextValue = {
  isEnabled: (key: string, safeDefault?: boolean) => boolean;
  status: "loading" | "ready" | "degraded";
  configurationVersion: number | null;
  propagationLagMs: number | null;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextValue>({
  isEnabled: (_key, safeDefault = false) => safeDefault,
  status: "degraded",
  configurationVersion: null,
  propagationLagMs: null,
});

export function FeatureFlagsProvider({
  tenant,
  children,
}: {
  tenant: string;
  children: ReactNode;
}) {
  const user = useUserSession();
  const query = useEvaluatedFeatureFlags({
    applicationVersion: APPLICATION_BUILD_NUMBER,
    tenant,
    userId: user?.id ?? null,
  });
  const refetch = query.refetch;

  const evaluation = useMemo(
    () =>
      parseFeatureFlagEvaluation(query.data, {
        applicationVersion: APPLICATION_BUILD_NUMBER,
      }),
    [query.data],
  );

  useEffect(() => {
    const refreshIfNewer = (event: Event) => {
      const nextVersion = (event as CustomEvent<number>).detail;
      if (Number.isInteger(nextVersion) &&
        (!evaluation || nextVersion > evaluation.config_version)) void refetch();
    };
    window.addEventListener("feature-flags-config-version", refreshIfNewer);
    return () => window.removeEventListener("feature-flags-config-version", refreshIfNewer);
  }, [evaluation, refetch]);

  const value = useMemo<FeatureFlagsContextValue>(() => {
    const status = evaluation
      ? "ready"
      : query.isPending
        ? "loading"
        : "degraded";
    return {
      isEnabled: (key, safeDefault = false) =>
        isFeatureEnabled(evaluation, key, safeDefault),
      status,
      configurationVersion: evaluation?.config_version ?? null,
      propagationLagMs: evaluation?.config_published_at
        ? Math.max(0, query.dataUpdatedAt - Date.parse(evaluation.config_published_at))
        : null,
    };
  }, [evaluation, query.dataUpdatedAt, query.isPending]);

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlagsContext() {
  return useContext(FeatureFlagsContext);
}

export function FeatureFlag({
  name,
  fallback = null,
  safeDefault = false,
  children,
}: {
  name: string;
  fallback?: ReactNode;
  safeDefault?: boolean;
  children: ReactNode;
}) {
  const { isEnabled } = useFeatureFlagsContext();
  return isEnabled(name, safeDefault) ? children : fallback;
}

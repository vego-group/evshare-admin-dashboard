"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useEvaluatedFeatureFlags } from "@/hooks/api";
import { setFeatureFlagRuntimeMetadata } from "@/lib/feature-flag-runtime";
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
  configurationVersion: string | null;
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
  const [now, setNow] = useState(() => Date.now());
  const query = useEvaluatedFeatureFlags({
    applicationVersion: APPLICATION_BUILD_NUMBER,
    tenant,
    userId: user?.id ?? null,
  });

  const evaluation = useMemo(
    () =>
      parseFeatureFlagEvaluation(query.data, {
        tenant,
        applicationVersion: APPLICATION_BUILD_NUMBER,
        now,
      }),
    [query.data, tenant, now],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!evaluation) {
      setFeatureFlagRuntimeMetadata(null);
      return;
    }
    setFeatureFlagRuntimeMetadata({
      configurationVersion: evaluation.configuration_version,
      evaluatedAt: evaluation.evaluated_at,
      receivedAt: new Date(query.dataUpdatedAt).toISOString(),
    });
    return () => setFeatureFlagRuntimeMetadata(null);
  }, [
    evaluation?.configuration_version,
    evaluation?.evaluated_at,
    query.dataUpdatedAt,
  ]);

  const value = useMemo<FeatureFlagsContextValue>(() => {
    const status = evaluation
      ? "ready"
      : query.isPending
        ? "loading"
        : "degraded";
    return {
      isEnabled: (key, safeDefault = false) =>
        isFeatureEnabled(evaluation, key, safeDefault, now),
      status,
      configurationVersion: evaluation?.configuration_version ?? null,
      propagationLagMs: evaluation
        ? Math.max(0, query.dataUpdatedAt - Date.parse(evaluation.published_at))
        : null,
    };
  }, [evaluation, now, query.dataUpdatedAt, query.isPending]);

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

"use client";

import { useSyncExternalStore } from "react";

import type { UserRole } from "@/types";
import { getQueryClient } from "./query";

const USER_SESSION_KEY = "user_data";
const USER_SESSION_EVENT = "user-session-change";

export type SessionUser = {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
};

export function setUserSession(user: SessionUser): boolean {
  if (typeof window === "undefined") return false;
  try {
    clearUserScopedCaches();
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(USER_SESSION_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function clearUserSession() {
  if (typeof window === "undefined") return;
  try {
    clearUserScopedCaches();
    localStorage.removeItem(USER_SESSION_KEY);
    window.dispatchEvent(new Event(USER_SESSION_EVENT));
  } catch {
    // ignore
  }
}

function clearUserScopedCaches() {
  getQueryClient().clear();
}

let cachedRaw: string | null = null;
let cachedUser: SessionUser | null = null;

function readSnapshot(): SessionUser | null {
  const raw = localStorage.getItem(USER_SESSION_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? JSON.parse(raw) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

function getServerSnapshot(): SessionUser | null {
  return null;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(USER_SESSION_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(USER_SESSION_EVENT, callback);
  };
}

export function useUserSession() {
  return useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
}

"use client";

import { useSyncExternalStore } from "react";

import type { UserRole } from "@/types";

const USER_SESSION_KEY = "user_data";
const USER_SESSION_EVENT = "user-session-change";

export type SessionUser = {
  id: string;
  name: string;
  mobile: string | number;
  role: UserRole;
};

export function setUserSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(USER_SESSION_EVENT));
  } catch {
    // ignore write failures (e.g. private browsing storage limits)
  }
}

export function clearUserSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_SESSION_KEY);
    window.dispatchEvent(new Event(USER_SESSION_EVENT));
  } catch {
    // ignore
  }
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

"use server";
import { cookies } from "next/headers";

const TOKEN_KEY = "token";
const COUNTRY_KEY = "tenant-country";
const COUNTRY_CODE_PATTERN = /^[a-z]{2}$/;
export const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value || null;
  return token;
};
export const setToken = async (value: string, expiresAt: string) => {
  const expiresAtMs = Date.parse(expiresAt);
  const maxAge = Math.floor((expiresAtMs - Date.now()) / 1000);

  if (!value || !Number.isFinite(expiresAtMs) || maxAge <= 0) {
    throw new Error("Cannot create a session from an invalid or expired token");
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: TOKEN_KEY,
    value: value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
};
export const removeToken = async () => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: TOKEN_KEY,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // expires immediately
  });
};

export const getCountry = async () => {
  const cookieStore = await cookies();
  const value = cookieStore.get(COUNTRY_KEY)?.value?.toLowerCase();
  return value && COUNTRY_CODE_PATTERN.test(value) ? value : null;
};

export const setCountry = async (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!COUNTRY_CODE_PATTERN.test(normalized)) {
    throw new Error("Cannot set an invalid tenant country");
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: COUNTRY_KEY,
    value: normalized,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
};

export const removeCountry = async () => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COUNTRY_KEY,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
};

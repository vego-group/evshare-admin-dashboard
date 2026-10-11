"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { removeCountry, removeToken } from "@/lib";
import { clearUserSession } from "@/lib/utils/user-session";
import { logoutAPI } from "@/services/mutations";

export default function AccessDeniedLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logoutAPI();
    } finally {
      try {
        await Promise.all([removeToken(), removeCountry()]);
      } finally {
        clearUserSession();
        window.location.replace("/login");
      }
    }
  };

  return (
    <Button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isLoggingOut}
      className="h-12 w-full rounded-xl text-sm font-bold text-secondary shadow-[0_10px_24px_rgba(255,208,29,0.28)]"
    >
      {isLoggingOut ? (
        <Loader />
      ) : (
        <>
          <LogOut className="size-4" />
          تسجيل الخروج والعودة لتسجيل الدخول
        </>
      )}
    </Button>
  );
}

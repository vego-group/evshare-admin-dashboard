"use client";

import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { RefreshCw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { formatPhoneNumberIntl } from "react-phone-number-input";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Loader from "@/components/ui/loader";
import { removeToken, setCountry, setToken } from "@/lib";
import { API_ERROR_CODES, getApiErrorCode } from "@/lib/utils/api-error";
import { clearUserSession, setUserSession } from "@/lib/utils/user-session";
import {
  authResponseSchema,
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "@/schemas";
import { resendLoginOtpAPI, verifyLoginAPI } from "@/services/mutations";

const verifyOtpResolver: Resolver<VerifyOtpFormValues> = async (values) => {
  const result = verifyOtpSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<VerifyOtpFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof VerifyOtpFormValues;
    if (!errors[field])
      errors[field] = { type: issue.code, message: issue.message };
  }
  return { values: {}, errors };
};

type OtpFormProps = {
  mobile: string;
  country: string;
};

export default function OtpForm({ mobile, country }: OtpFormProps) {
  const router = useRouter();
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string>();
  const [mustResend, setMustResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    defaultValues: { mobile, otp: "" },
    resolver: verifyOtpResolver,
    mode: "onChange",
  });

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = window.setInterval(
      () => setRetryAfter((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [retryAfter]);

  const onSubmit = async (data: VerifyOtpFormValues) => {
    if (accessDeniedMessage) {
      toast.error(accessDeniedMessage);
      return;
    }
    if (mustResend) {
      toast.error("يجب طلب رمز تحقق جديد أولاً.");
      return;
    }

    const result = await verifyLoginAPI(data);
    if (!result.ok) {
      const code = getApiErrorCode(result.error);
      if (
        code === API_ERROR_CODES.otpExpired ||
        code === API_ERROR_CODES.otpAttemptsExceeded
      ) {
        setMustResend(true);
      }
      if (
        code === API_ERROR_CODES.accountSuspended ||
        code === API_ERROR_CODES.tenantMismatch ||
        code === API_ERROR_CODES.roleForbidden
      ) {
        setAccessDeniedMessage(result.message);
      }
      toast.error(result.message || "رمز التحقق غير صحيح");
      return;
    }

    const authResult = authResponseSchema.safeParse(result.data);
    if (!authResult.success) {
      await removeToken();
      clearUserSession();
      toast.error("استجابة تسجيل الدخول غير مكتملة، يرجى المحاولة مرة أخرى");
      return;
    }

    const {
      access_token: token,
      expires_at: expiresAt,
      tenant,
      user_data: userData,
    } = authResult.data.data;

    if (tenant.code !== country) {
      await removeToken();
      clearUserSession();
      setAccessDeniedMessage(
        "الجلسة تخص دولة أخرى. سجّل الدخول للدولة المحددة من جديد.",
      );
      return;
    }

    try {
      await Promise.all([setToken(token, expiresAt), setCountry(tenant.code)]);
      if (!setUserSession(userData)) {
        throw new Error("Could not persist the authenticated user");
      }
    } catch {
      await removeToken();
      clearUserSession();
      toast.error("تعذر إنشاء جلسة آمنة، يرجى المحاولة مرة أخرى");
      return;
    }

    toast.success(result.message || "تم تسجيل الدخول بنجاح");
    router.replace("/");
  };

  async function resendCode() {
    if (isResending || retryAfter > 0 || accessDeniedMessage) return;
    setIsResending(true);
    const result = await resendLoginOtpAPI(mobile);
    setIsResending(false);

    if (result.retryAfterSeconds) setRetryAfter(result.retryAfterSeconds);
    if (!result.ok) {
      const code = getApiErrorCode(result.error);
      if (
        code === API_ERROR_CODES.accountSuspended ||
        code === API_ERROR_CODES.tenantMismatch ||
        code === API_ERROR_CODES.roleForbidden
      ) {
        setAccessDeniedMessage(result.message);
      }
      toast.error(result.message || "تعذر إعادة إرسال رمز التحقق");
      return;
    }

    setMustResend(false);
    setValue("otp", "");
    toast.success(result.message || "تم إرسال رمز تحقق جديد");
  }

  const displayPhone = mobile
    ? formatPhoneNumberIntl(`+${mobile}`) || `+${mobile}`
    : "";

  return (
    <form
      className="space-y-5 px-3 py-5 md:px-4 md:py-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-0.5 text-center">
        <p className="text-sm text-gray-500">تم إرسال رمز التحقق إلى</p>
        <p className="font-semibold text-secondary" dir="ltr">
          {displayPhone}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div dir="ltr">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                onComplete={() => void handleSubmit(onSubmit)()}
                disabled={
                  isSubmitting || Boolean(accessDeniedMessage) || mustResend
                }
              >
                <InputOTPGroup className="flex items-center">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="mx-1">
                      <InputOTPSlot
                        index={index}
                        className="h-11 w-10 rounded-md border border-[#dbe4ef] bg-white text-secondary"
                      />
                    </div>
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>
        <InputErrorMessage msg={errors.otp?.message} />
        {mustResend && (
          <p className="text-xs text-red-600">
            انتهت صلاحية الرمز أو استُنفدت المحاولات. اطلب رمزاً جديداً.
          </p>
        )}
        {accessDeniedMessage && (
          <p className="text-xs text-red-600">{accessDeniedMessage}</p>
        )}
      </div>

      <motion.div whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          disabled={isSubmitting || mustResend || Boolean(accessDeniedMessage)}
          className="h-10 w-full rounded-lg bg-primary font-bold text-secondary shadow-[0_10px_24px_rgba(255,208,29,0.35)] hover:bg-primary/95"
        >
          {isSubmitting ? (
            <Loader />
          ) : (
            <>
              <ShieldCheck className="size-4 shrink-0" />
              تحقق من الرمز
            </>
          )}
        </Button>
      </motion.div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => void resendCode()}
        disabled={isResending || retryAfter > 0 || Boolean(accessDeniedMessage)}
        className="h-10 w-full gap-2"
      >
        {isResending ? <Loader /> : <RefreshCw className="size-4" />}
        {retryAfter > 0
          ? `إعادة الإرسال بعد ${retryAfter} ث`
          : "إعادة إرسال الرمز"}
      </Button>
    </form>
  );
}

"use client";

import {
  useForm,
  Controller,
  type Resolver,
  type FieldErrors,
} from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { verifyOtpSchema, type VerifyOtpFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyLoginAPI } from "@/services/mutations";
import { setToken } from "@/lib";
import Loader from "@/components/ui/loader";
import InputErrorMessage from "@/components/ui/input-error-message";
import { useRouter } from "next/navigation";

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

interface OtpFormProps {
  mobile: string;
}

function OtpForm({ mobile }: OtpFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    defaultValues: { mobile, otp: "" },
    resolver: verifyOtpResolver,
    mode: "onChange",
  });

  const onSubmit = async (data: VerifyOtpFormValues) => {
    const result = await verifyLoginAPI(data);

    if (result?.ok) {
      toast.success(result.message || "تم تسجيل الدخول بنجاح");
      const token = result.data?.data?.access_token;
      if (token) await setToken(token);
      router.replace("/");
      return;
    }

    toast.error(result?.message || "رمز التحقق غير صحيح");
  };

  const displayPhone = mobile
    ? `+${mobile.slice(0, 3)} ${mobile.slice(3)}`
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
              >
                <InputOTPGroup className="flex items-center">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="mx-1">
                      <InputOTPSlot
                        index={i}
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
      </div>

      <motion.div whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg bg-primary font-bold text-secondary shadow-[0_10px_24px_rgba(255,208,29,0.35)] hover:bg-primary/95"
        >
          {isSubmitting ? (
            <Loader />
          ) : (
            <>
              <ShieldCheck className="size-4" />
              تحقق من الرمز
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}

export default OtpForm;

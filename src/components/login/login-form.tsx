"use client";

import { useForm, type Resolver, type FieldErrors } from "react-hook-form";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { loginSchema, type LoginFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import PhoneField from "./phone-field";
import { loginAPI } from "@/services/mutations";
import { normalizePhone } from "@/lib";
import Loader from "../ui/loader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCountries } from "@/hooks/api";
import type { CountryCode } from "@/types";
import { phoneCountries } from "@/data";

const loginFormResolver: Resolver<LoginFormValues> = async (values) => {
  const result = loginSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<LoginFormValues> = {};
  const issue = result.error.issues.find((i) => i.path[0] === "mobile");
  if (issue) errors.mobile = { type: issue.code, message: issue.message };

  return { values: {}, errors };
};

function LoginForm() {
  const router = useRouter();
  const [country, setCountry] = useState<CountryCode>("sa");
  const { data: countries } = useCountries();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { mobile: "" },
    resolver: loginFormResolver,
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!phoneCountries[country].localPattern.test(data.mobile)) {
      toast.error("رقم الجوال غير صحيح للدولة المحددة");
      return;
    }
    const normalized = normalizePhone(data.mobile, country);
    const result = await loginAPI({ mobile: normalized }, country);
    if (result?.ok) {
      toast.success(result.message || "تم إرسال رمز التحقق");
      router.push(`/login/verify-otp?mobile=${encodeURIComponent(normalized)}&country=${country}`);
      return;
    }

    toast.error(result?.message || "حدث خطأ، حاول مرة أخرى");
  };

  return (
    <form
      className="space-y-3 px-3 py-5 md:px-4 md:py-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PhoneField
        id="mobile"
        label="رقم الجوال"
        placeholder={phoneCountries[country].placeholder}
        countries={(countries?.data ?? []).filter((item) => item.active)}
        country={country}
        onCountryChange={setCountry}
        error={errors.mobile?.message}
        {...register("mobile")}
      />

      <motion.div whileTap={{ scale: 0.99 }} className="pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg bg-primary font-bold text-secondary shadow-[0_10px_24px_rgba(255,208,29,0.35)] hover:bg-primary/95"
        >
          {isSubmitting ? (
            <Loader />
          ) : (
            <>
              <LogIn className="size-4 shrink-0" />
              إرسال رمز التحقق
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}

export default LoginForm;

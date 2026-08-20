"use client";

import { useForm, type Resolver, type FieldErrors } from "react-hook-form";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { loginSchema, type LoginFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import PhoneField from "./phone-field";
import { loginAPI } from "@/services/mutations";
import { normalizeSaudiPhone } from "@/lib";
import Loader from "../ui/loader";
import { useRouter } from "next/navigation";
import { useCountries } from "@/hooks";
import { countryCodeSchema } from "@/schemas";
import CountrySelect from "./country-select";
import { useState } from "react";

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
  const { data: countriesResponse, isLoading: countriesLoading } = useCountries();
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState<string>();
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
    const selectedCountry = countryCodeSchema.safeParse(country);
    if (!selectedCountry.success) {
      setCountryError(selectedCountry.error.issues[0]?.message);
      return;
    }
    const normalized = normalizeSaudiPhone(data.mobile);
    const result = await loginAPI({ mobile: normalized }, selectedCountry.data);
    if (result?.ok) {
      toast.success(result.message || "تم إرسال رمز التحقق");
      router.push(`/login/verify-otp?mobile=${encodeURIComponent(normalized)}&country=${selectedCountry.data}`);
      return;
    }

    toast.error(result?.message || "حدث خطأ، حاول مرة أخرى");
  };

  return (
    <form
      className="space-y-3 px-3 py-5 md:px-4 md:py-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <CountrySelect
        countries={countriesResponse?.data ?? []}
        value={country}
        error={countryError}
        disabled={countriesLoading}
        onChange={(value) => { setCountry(value); setCountryError(undefined); }}
      />
      <PhoneField
        id="mobile"
        label="رقم الجوال"
        placeholder="5x xxx xxxx"
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

import OtpVerify from "@/components/login/otp-verify";
import { getCountry, getToken } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ mobile?: string }>;
};

export default async function VerifyOtpPage({ searchParams }: Props) {
  const [params, country, token] = await Promise.all([
    searchParams,
    getCountry(),
    getToken(),
  ]);
  if (token) redirect("/");
  if (!country) redirect("/login");

  return <OtpVerify mobile={params.mobile ?? ""} country={country} />;
}

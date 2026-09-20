import OtpVerify from "@/components/login/otp-verify";
import { getCountry } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ mobile?: string }>;
};

export default async function VerifyOtpPage({ searchParams }: Props) {
  const [params, country] = await Promise.all([searchParams, getCountry()]);
  if (!country) redirect("/login");

  return <OtpVerify mobile={params.mobile ?? ""} />;
}

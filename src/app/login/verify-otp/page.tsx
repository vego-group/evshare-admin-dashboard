import OtpVerify from "@/components/login/otp-verify";

type Props = {
  searchParams: Promise<{ mobile?: string; country?: string }>;
};

export default async function VerifyOtpPage({ searchParams }: Props) {
  const { mobile = "", country = "sa" } = await searchParams;
  return <OtpVerify mobile={mobile} country={country} />;
}

import OtpVerify from "@/components/login/otp-verify";

type Props = {
  searchParams: Promise<{ mobile?: string }>;
};

export default async function VerifyOtpPage({ searchParams }: Props) {
  const { mobile = "" } = await searchParams;
  return <OtpVerify mobile={mobile} />;
}

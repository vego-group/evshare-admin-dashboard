import OtpVerify from "@/components/login/otp-verify";
import { countryCodeSchema } from "@/schemas/countries";

type Props = {
  searchParams: Promise<{ mobile?: string; country?: string }>;
};

export default async function VerifyOtpPage({ searchParams }: Props) {
  const { mobile = "", country } = await searchParams;
  const tenant = countryCodeSchema.safeParse(country).data ?? "sa";
  return <OtpVerify mobile={mobile} country={tenant} />;
}

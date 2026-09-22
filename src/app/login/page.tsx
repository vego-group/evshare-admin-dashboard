import Login from "@/components/login/login";
import { getToken } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ expired?: string }>;
};

async function LoginPage({ searchParams }: Props) {
  const [params, token] = await Promise.all([searchParams, getToken()]);

  // Reading the cookie here makes this route dynamic and prevents a cached
  // login page from being shown after the user has authenticated. The proxy
  // remains the first guard; this is a server-side fallback for route/CDN
  // caches. An explicitly expired session must still be allowed to log in.
  if (token && params.expired !== "1") redirect("/");

  return <Login />;
}

export default LoginPage;

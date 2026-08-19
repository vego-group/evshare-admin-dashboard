import { NextResponse } from "next/server";

export async function GET() {
  const authBase = process.env.NEXT_PUBLIC_API_AUTH_BASE_URL;
  if (!authBase) {
    return NextResponse.json({ message: "Auth API is not configured" }, { status: 500 });
  }

  const url = `${new URL(authBase).origin}/api/v1/app/countries`;
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Language": "ar" },
      cache: "no-store",
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "تعذر الاتصال بخدمة الدول" }, { status: 502 });
  }
}

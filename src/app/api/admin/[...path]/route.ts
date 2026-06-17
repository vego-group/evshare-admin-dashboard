import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const baseUrl = process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "Admin API base URL is not configured" },
      { status: 500 },
    );
  }

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { path } = await context.params;
  const upstreamUrl = new URL(path.join("/"), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  upstreamUrl.search = request.nextUrl.search;

  const upstreamResponse = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": "ar",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = await upstreamResponse.text();
  const contentType = upstreamResponse.headers.get("content-type");

  return new NextResponse(body, {
    status: upstreamResponse.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });
}

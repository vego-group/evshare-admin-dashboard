import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const exportIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const flagVersionPattern = /^[a-zA-Z0-9._:-]{1,128}$/;

function featureFlagConsumerHeaders(request: NextRequest): Record<string, string> {
  const version = request.headers.get("X-Feature-Flag-Version");
  const evaluatedAt = request.headers.get("X-Feature-Flag-Evaluated-At");
  const receivedAt = request.headers.get("X-Feature-Flag-Received-At");
  if (
    !version ||
    !flagVersionPattern.test(version) ||
    !evaluatedAt ||
    !Number.isFinite(Date.parse(evaluatedAt)) ||
    !receivedAt ||
    !Number.isFinite(Date.parse(receivedAt))
  ) {
    return {};
  }
  return {
    "X-Feature-Flag-Version": version,
    "X-Feature-Flag-Evaluated-At": evaluatedAt,
    "X-Feature-Flag-Received-At": receivedAt,
  };
}

function messageFrom(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
    return payload.message || fallback;
  }
  return fallback;
}

async function downloadExport(
  adminBase: URL,
  statusPath: string,
  id: string,
  token: string,
  country: string,
  filePrefix: string,
) {
  if (!exportIdPattern.test(id)) {
    return NextResponse.json({ message: "معرّف التصدير غير صالح" }, { status: 400 });
  }

  try {
    const statusResponse = await fetch(new URL(statusPath, adminBase), {
      headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        Authorization: `Bearer ${token}`,
        "X-Tenant-Id": country,
      },
      cache: "no-store",
    });
    const statusPayload: unknown = await statusResponse.json().catch(() => null);
    if (!statusResponse.ok) {
      return NextResponse.json(
        { message: messageFrom(statusPayload, "تعذر التحقق من حالة التصدير") },
        { status: statusResponse.status },
      );
    }

    const payload = statusPayload && typeof statusPayload === "object" && "data" in statusPayload
      ? statusPayload.data : statusPayload;
    if (!payload || typeof payload !== "object" || !("status" in payload)) {
      return NextResponse.json({ message: "استجابة حالة التصدير غير صالحة" }, { status: 502 });
    }
    const item = payload as {
      status: unknown;
      download_url?: unknown;
      file_name?: unknown;
      error?: unknown;
    };
    if (item.status !== "completed" || typeof item.download_url !== "string") {
      return NextResponse.json(
        { message: typeof item.error === "string" ? item.error : "ملف التصدير غير متاح للتنزيل" },
        { status: 409 },
      );
    }

    const signedUrl = new URL(item.download_url, adminBase);
    if (signedUrl.origin !== adminBase.origin || !["http:", "https:"].includes(signedUrl.protocol)) {
      return NextResponse.json({ message: "رابط التنزيل غير صالح" }, { status: 502 });
    }
    const downloadResponse = await fetch(signedUrl, { cache: "no-store", redirect: "manual" });
    if (!downloadResponse.ok) {
      const errorPayload: unknown = await downloadResponse.json().catch(() => null);
      return NextResponse.json(
        { message: messageFrom(errorPayload, "تعذر تنزيل ملف التصدير") },
        { status: downloadResponse.status },
      );
    }

    const contentType = downloadResponse.headers.get("content-type") || "";
    if (!contentType.includes("text/csv") && !contentType.includes("application/octet-stream")) {
      return NextResponse.json({ message: "استجابة التنزيل ليست ملف CSV" }, { status: 502 });
    }
    const fileName = typeof item.file_name === "string"
      ? item.file_name.replace(/[^a-zA-Z0-9._-]/g, "_")
      : `${filePrefix}-${id}.csv`;
    return new NextResponse(downloadResponse.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
        "X-Export-Filename": fileName,
      },
    });
  } catch {
    return NextResponse.json({ message: "تعذر الاتصال بخدمة التصدير" }, { status: 502 });
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const baseUrl = process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "Admin API base URL is not configured" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const country = cookieStore.get("tenant-country")?.value?.toLowerCase();

  if (!token || !country || !/^[a-z]{2}$/.test(country)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { path } = await context.params;
  const adminBase = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  if (path.length === 5 && path[0] === "finance" && path[1] === "vat" && path[2] === "exports" && path[4] === "download") {
    return downloadExport(adminBase, `finance/vat/exports/${path[3]}`, path[3], token, country, "vat-export");
  }
  if (path.length === 4 && path[0] === "reports" && path[1] === "exports" && path[3] === "download") {
    return downloadExport(adminBase, `reports/exports/${path[2]}`, path[2], token, country, "report");
  }

  const upstreamUrl = new URL(path.join("/"), adminBase);
  upstreamUrl.search = request.nextUrl.search;

  const upstreamResponse = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": "ar",
      Authorization: `Bearer ${token}`,
      "X-Tenant-Id": country,
      ...featureFlagConsumerHeaders(request),
    },
    cache: "no-store",
  });

  const body = await upstreamResponse.text();
  const contentType = upstreamResponse.headers.get("content-type");

  const response = new NextResponse(body, {
    status: upstreamResponse.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });
  response.headers.set(
    "X-Tenant-Id",
    upstreamResponse.headers.get("X-Tenant-Id") || country,
  );
  return response;
}

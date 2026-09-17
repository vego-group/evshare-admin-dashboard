import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

function messageFrom(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ message: "معرف التصدير غير صالح" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ message: "عنوان واجهة الإدارة غير مضبوط" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const tenant = cookieStore.get("tenant-country")?.value || "sa";
  if (!token) {
    return NextResponse.json({ message: "انتهت جلسة الدخول" }, { status: 401 });
  }

  try {
    const adminBase = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    const statusUrl = new URL(`finance/vat/exports/${id}`, adminBase);
    const statusResponse = await fetch(statusUrl, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        Authorization: `Bearer ${token}`,
        "X-Tenant-Id": tenant,
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
      ? statusPayload.data
      : statusPayload;
    if (!payload || typeof payload !== "object" || !("status" in payload)) {
      return NextResponse.json({ message: "استجابة حالة التصدير غير صالحة" }, { status: 502 });
    }

    const vatExport = payload as {
      status: unknown;
      download_url?: unknown;
      file_name?: unknown;
      error?: unknown;
    };
    if (vatExport.status !== "completed" || typeof vatExport.download_url !== "string") {
      return NextResponse.json(
        { message: typeof vatExport.error === "string" ? vatExport.error : "ملف التصدير غير متاح للتنزيل" },
        { status: 409 },
      );
    }

    const signedUrl = new URL(vatExport.download_url);
    if (signedUrl.origin !== adminBase.origin || !["http:", "https:"].includes(signedUrl.protocol)) {
      return NextResponse.json({ message: "رابط التنزيل غير صالح" }, { status: 502 });
    }

    const downloadResponse = await fetch(vatExport.download_url, {
      cache: "no-store",
      redirect: "manual",
    });
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

    const fileName = typeof vatExport.file_name === "string"
      ? vatExport.file_name.replace(/[^a-zA-Z0-9._-]/g, "_")
      : `vat-export-${id}.csv`;
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

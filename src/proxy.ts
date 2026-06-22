import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/login/verify-otp"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isExpiredSession = request.nextUrl.searchParams.get("expired") === "1";

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute && isExpiredSession) {
    const response = NextResponse.next();
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon\\.ico|images/).*)"],
};

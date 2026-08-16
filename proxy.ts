import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPath = path === "/login" || path.startsWith("/api/auth") || path.startsWith("/_next") || path.startsWith("/icons") || path === "/sw.js" || path === "/manifest.webmanifest";
  if (!publicPath && !request.cookies.get(SESSION_COOKIE)?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

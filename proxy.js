import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";

// Routes that require a valid admin session.
const PROTECTED_PREFIXES = ["/admin/dashboard", "/admin/leads", "/admin/contacts"];

// Next.js 16 renamed the `middleware` file convention to `proxy`. The behaviour
// is identical (Next maps `proxy` back to the middleware runtime internally) —
// this is the same admin-route guard as before, just under the new convention.
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const payload = await verifyToken(token);

  if (!payload) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/leads/:path*", "/admin/contacts/:path*"],
};

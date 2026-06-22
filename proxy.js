import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";

// Routes that require a valid admin session.
const PROTECTED_PREFIXES = ["/admin/dashboard", "/admin/leads", "/admin/contacts"];
const LOGIN_PATH = "/admin/login";

// Prevent the browser's back/forward cache (bfcache) from re-displaying an
// authenticated page after logout — or the login page after sign-in. Forcing a
// revalidation makes the browser re-run this proxy on back/forward navigation,
// which then redirects appropriately instead of restoring a stale page.
function noStore(response) {
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
}

// Next.js 16 renamed the `middleware` file convention to `proxy`. The behaviour
// is identical (Next maps `proxy` back to the middleware runtime internally).
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isLogin = pathname === LOGIN_PATH;

  if (!isProtected && !isLogin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const payload = await verifyToken(token);

  // Login page: an already-authenticated admin should never see it — send them
  // straight to the dashboard. Otherwise allow the login page (no-store so the
  // back button can't restore a stale authenticated view).
  if (isLogin) {
    if (payload) {
      return noStore(NextResponse.redirect(new URL("/admin/dashboard", request.url)));
    }
    return noStore(NextResponse.next());
  }

  // Protected route: require a valid session, else redirect to login.
  if (!payload) {
    return noStore(NextResponse.redirect(new URL(LOGIN_PATH, request.url)));
  }

  return noStore(NextResponse.next());
}

export const config = {
  matcher: [
    "/admin/login",
    "/admin/dashboard/:path*",
    "/admin/leads/:path*",
    "/admin/contacts/:path*",
  ],
};

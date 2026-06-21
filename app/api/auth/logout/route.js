import { NextResponse } from "next/server";
import { AUTH_COOKIE, clearCookieOptions } from "@/lib/auth";

// POST /api/auth/logout
// Clears the admin session cookie. Uses the shared clear options so the cookie
// attributes always match the ones used at login (required for reliable clearing).
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, "", clearCookieOptions);
  return res;
}

import { NextResponse } from "next/server";
import { AUTH_COOKIE, cookieOptions } from "@/lib/auth";
import { authenticateAdmin } from "@/services/auth.service";

// POST /api/auth/login
// Verifies admin credentials and sets an httpOnly session cookie.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const result = await authenticateAdmin(email, password);

    if (!result) {
      // Same generic message whether the email or the password is wrong.
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(AUTH_COOKIE, result.token, cookieOptions);
    return res;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

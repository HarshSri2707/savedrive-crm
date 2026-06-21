import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { getContactFilterOptions } from "@/services/contact.service";

// GET /api/contacts/options
// Admin-only. Returns lightweight stats for the contacts filter bar.
// (No city/state dropdowns — the Contact model has no such fields.)
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const options = await getContactFilterOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error("Failed to load contact options:", error);
    return NextResponse.json(
      { error: "Failed to load contact options" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { listContacts } from "@/services/contact.service";

// GET /api/contacts
// Admin-only. Returns a paginated, searchable, date-filterable list of contacts.
// Query params: ?page=1&limit=10&search=<term>&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
// Guarded here since the middleware matcher only covers /admin/* pages.
export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  try {
    const result = await listContacts(searchParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to list contacts:", error);
    return NextResponse.json(
      { error: "Failed to load contacts" },
      { status: 500 }
    );
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { getLeadsForExport } from "@/services/lead.service";

const COLUMNS = [
  "ZIP Code",
  "City",
  "State",
  "Name",
  "Email",
  "Phone",
  "Status",
  "Created Date",
];

// Quote a CSV field, escaping embedded quotes, and always wrap so commas /
// newlines in the data can't break the row structure.
function csvCell(value) {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

// GET /api/leads/export
// Admin-only. Streams a CSV of leads matching the same filters as the list
// endpoint (search, status, city, state, fromDate, toDate). No filters = all.
export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  try {
    const leads = await getLeadsForExport(searchParams);

    const rows = leads.map((l) =>
      [
        l.zipCode,
        l.city,
        l.state,
        l.name,
        l.email,
        l.phone,
        l.status,
        new Date(l.createdAt).toISOString(),
      ]
        .map(csvCell)
        .join(",")
    );

    // Header row is always present, so an empty result still yields a valid
    // (header-only) CSV file rather than an empty download.
    const csv = [COLUMNS.map(csvCell).join(","), ...rows].join("\r\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="leads.csv"',
      },
    });
  } catch (error) {
    console.error("Failed to export leads:", error);
    return NextResponse.json(
      { error: "Failed to export leads" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { createLead, listLeads } from "@/services/lead.service";

// Basic email shape check — mirrors the client-side check in the Hero form.
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// GET /api/leads
// Admin-only. Returns a paginated, searchable, filterable list of leads.
// Query params: ?page=1&limit=10&search=<term>
//   &status=NEW&city=...&state=...&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
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
    const result = await listLeads(searchParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to list leads:", error);
    return NextResponse.json(
      { error: "Failed to load leads" },
      { status: 500 }
    );
  }
}

// POST /api/leads
// Public endpoint that accepts a lead from the quote form and stores it.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Pull only the fields we persist; ignore anything extra.
  const zipCode = body?.zipCode?.toString().trim();
  const city = body?.city?.toString().trim() || "";
  const state = body?.state?.toString().trim() || "";
  const name = body?.name?.toString().trim();
  const email = body?.email?.toString().trim();
  const phone = body?.phone?.toString().trim();

  // ── Validation: required fields ──
  const missing = [];
  if (!zipCode) missing.push("zipCode");
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!phone) missing.push("phone");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: "Missing required fields",
        fields: missing,
      },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Invalid email address", fields: ["email"] },
      { status: 400 }
    );
  }

  try {
    const lead = await createLead({ zipCode, city, state, name, email, phone });
    return NextResponse.json(
      { success: true, id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create lead:", error);
    return NextResponse.json(
      { error: "Something went wrong while saving your request" },
      { status: 500 }
    );
  }
}

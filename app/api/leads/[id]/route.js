import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { VALID_STATUSES } from "@/lib/leadFilters";
import {
  getLeadById,
  deleteLead,
  updateLeadStatus,
} from "@/services/lead.service";

// GET /api/leads/[id]
// Admin-only. Returns the full details for a single lead.
// Guarded here since the middleware matcher only covers /admin/* pages.
export async function GET(request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Failed to load lead:", error);
    return NextResponse.json(
      { error: "Failed to load lead" },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id]
// Admin-only. Deletes a single lead by id.
export async function DELETE(request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await deleteLead(id);
    if (!deleted) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/[id]
// Admin-only. Updates a lead's status and returns the updated lead.
export async function PATCH(request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const status = body?.status?.toString().trim().toUpperCase();

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status", allowed: VALID_STATUSES },
      { status: 400 }
    );
  }

  try {
    const lead = await updateLeadStatus(id, status);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}

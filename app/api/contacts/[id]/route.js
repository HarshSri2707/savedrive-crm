import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { getContactById, deleteContact } from "@/services/contact.service";

// GET /api/contacts/[id]
// Admin-only. Returns the full details for a single contact.
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
    const contact = await getContactById(id);

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Failed to load contact:", error);
    return NextResponse.json(
      { error: "Failed to load contact" },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id]
// Admin-only. Deletes a single contact by id.
export async function DELETE(request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await deleteContact(id);
    if (!deleted) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}

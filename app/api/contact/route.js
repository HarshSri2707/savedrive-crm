import { NextResponse } from "next/server";
import { createContact } from "@/services/contact.service";

// Basic email shape check — same pattern used elsewhere in the app.
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// POST /api/contact
// Public endpoint that accepts a contact-form submission and stores it.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body?.name?.toString().trim();
  const email = body?.email?.toString().trim();
  const phone = body?.phone?.toString().trim() || "";
  const message = body?.message?.toString().trim();

  // ── Validation ──
  const missing = [];
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!message) missing.push("message");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing required fields", fields: missing },
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
    const contact = await createContact({ name, email, phone, message });
    return NextResponse.json(
      { success: true, id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create contact:", error);
    return NextResponse.json(
      { error: "Something went wrong while sending your message" },
      { status: 500 }
    );
  }
}

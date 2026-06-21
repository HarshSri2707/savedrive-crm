// Contact business logic. All Prisma access for contacts lives here.
import prisma from "@/lib/prisma";
import { buildContactWhere } from "@/lib/contactFilters";

// Fields returned to the admin contacts views.
const CONTACT_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  message: true,
  createdAt: true,
};

// Fields included in a CSV export (matches the export column order; no id).
const EXPORT_SELECT = {
  name: true,
  email: true,
  phone: true,
  message: true,
  createdAt: true,
};

// Persist a contact-form submission.
export async function createContact({ name, email, phone, message }) {
  return prisma.contact.create({
    data: { name, email, phone: phone || null, message },
  });
}

// Paginated, searchable, date-filterable list of contacts (newest first).
export async function listContacts(searchParams) {
  // Clamp pagination to sane bounds.
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit"), 10) || 10)
  );
  const where = buildContactWhere(searchParams);

  const [total, contacts] = await Promise.all([
    prisma.contact.count({ where }),
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: CONTACT_SELECT,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { contacts, pagination: { page, limit, total, totalPages } };
}

// Full details for a single contact, or null if it doesn't exist.
export async function getContactById(id) {
  return prisma.contact.findUnique({ where: { id }, select: CONTACT_SELECT });
}

// Delete a contact. Returns true if deleted, false if it didn't exist.
export async function deleteContact(id) {
  try {
    await prisma.contact.delete({ where: { id } });
    return true;
  } catch (error) {
    // Prisma throws P2025 when the record to delete doesn't exist.
    if (error?.code === "P2025") return false;
    throw error;
  }
}

// Lightweight stats for the filter bar (no city/state — Contact has no such fields).
export async function getContactFilterOptions() {
  const totalContacts = await prisma.contact.count();
  return { totalContacts };
}

// Contacts matching the given filters, for CSV export. No filters = all.
export async function getContactsForExport(searchParams) {
  const where = buildContactWhere(searchParams);
  return prisma.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: EXPORT_SELECT,
  });
}

// Lead business logic. All Prisma access for leads lives here so route
// handlers stay limited to request validation and response shaping.
import prisma from "@/lib/prisma";
import { buildLeadWhere } from "@/lib/leadFilters";

// Fields returned to admin views (list, detail, status update).
const LEAD_SELECT = {
  id: true,
  zipCode: true,
  city: true,
  state: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
};

// Fields included in a CSV export (matches the export column order; no id).
const EXPORT_SELECT = {
  zipCode: true,
  city: true,
  state: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
};

// Create a lead from the public quote form.
export async function createLead({ zipCode, city, state, name, email, phone }) {
  return prisma.lead.create({
    data: { zipCode, city, state, name, email, phone },
  });
}

// Paginated, searchable, filterable list of leads + pagination metadata.
export async function listLeads(searchParams) {
  // Clamp pagination to sane bounds.
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit"), 10) || 10)
  );
  const where = buildLeadWhere(searchParams);

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: LEAD_SELECT,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { leads, pagination: { page, limit, total, totalPages } };
}

// Full details for a single lead, or null if it doesn't exist.
export async function getLeadById(id) {
  return prisma.lead.findUnique({ where: { id }, select: LEAD_SELECT });
}

// Delete a lead. Returns true if deleted, false if it didn't exist.
export async function deleteLead(id) {
  try {
    await prisma.lead.delete({ where: { id } });
    return true;
  } catch (error) {
    // Prisma throws P2025 when the record to delete doesn't exist.
    if (error?.code === "P2025") return false;
    throw error;
  }
}

// Update a lead's status. Returns the updated lead, or null if it didn't exist.
export async function updateLeadStatus(id, status) {
  try {
    return await prisma.lead.update({
      where: { id },
      data: { status },
      select: LEAD_SELECT,
    });
  } catch (error) {
    // Prisma throws P2025 when the record to update doesn't exist.
    if (error?.code === "P2025") return null;
    throw error;
  }
}

// Distinct cities and states, used to populate the filter dropdowns.
export async function getLeadFilterOptions() {
  const [cities, states] = await Promise.all([
    prisma.lead.findMany({
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
    prisma.lead.findMany({
      distinct: ["state"],
      select: { state: true },
      orderBy: { state: "asc" },
    }),
  ]);

  return {
    cities: cities.map((c) => c.city).filter(Boolean),
    states: states.map((s) => s.state).filter(Boolean),
  };
}

// Leads matching the given filters, for CSV export. No filters = all leads.
export async function getLeadsForExport(searchParams) {
  const where = buildLeadWhere(searchParams);
  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: EXPORT_SELECT,
  });
}

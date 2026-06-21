// Builds a Prisma `where` clause for the Contact model from URL search params.
// Shared by the list endpoint (/api/contacts) and the CSV export
// (/api/contacts/export) so both honour exactly the same filters.

export function buildContactWhere(searchParams) {
  const search = (searchParams.get("search") || "").trim();
  const fromDate = (searchParams.get("fromDate") || "").trim();
  const toDate = (searchParams.get("toDate") || "").trim();

  // Each filter contributes a clause; they're combined with AND so they
  // narrow results together, alongside the search term.
  const and = [];

  if (search) {
    and.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  // Date range filters on createdAt. toDate is inclusive of the whole day.
  const createdAt = {};
  const from = fromDate ? new Date(fromDate) : null;
  if (from && !isNaN(from)) {
    createdAt.gte = from;
  }
  const to = toDate ? new Date(toDate) : null;
  if (to && !isNaN(to)) {
    to.setHours(23, 59, 59, 999);
    createdAt.lte = to;
  }
  if (Object.keys(createdAt).length > 0) {
    and.push({ createdAt });
  }

  return and.length > 0 ? { AND: and } : {};
}

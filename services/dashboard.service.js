// Dashboard business logic. All Prisma access for dashboard stats lives here.
import prisma from "@/lib/prisma";

// Lead counts (total, today, per-status) plus the latest 10 leads.
export async function getDashboardStats() {
  // Start of today in server local time.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalLeads,
    todayLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    closedLeads,
    latestLeads,
    totalContacts,
    todayContacts,
    latestContacts,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONTACTED" } }),
    prisma.lead.count({ where: { status: "QUALIFIED" } }),
    prisma.lead.count({ where: { status: "CLOSED" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        zipCode: true,
        createdAt: true,
      },
    }),
    prisma.contact.count(),
    prisma.contact.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalLeads,
    todayLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    closedLeads,
    latestLeads,
    totalContacts,
    todayContacts,
    latestContacts,
  };
}

"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

function formatDate(value) {
  const d = new Date(value);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-[14px] p-5 shadow-[var(--shadow-sm)] border border-[var(--gray-100)]">
      <p className="text-[0.78rem] font-semibold text-[var(--gray-400)] uppercase tracking-[0.05em]">
        {label}
      </p>
      <p className="text-[2rem] font-black text-[var(--gray-900)] mt-1" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load dashboard data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--gray-50)]">
      <AdminSidebar />

      <main className="flex-1 p-8 max-[768px]:p-5 overflow-x-auto">
        <header className="mb-7">
          <h1 className="text-[1.6rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em]">
            Dashboard
          </h1>
          <p className="text-[0.88rem] text-[var(--gray-500)] mt-1">
            Overview of your incoming leads.
          </p>
        </header>

        {loading && (
          <p className="text-[0.9rem] text-[var(--gray-500)]">Loading...</p>
        )}

        {error && !loading && (
          <p className="text-[0.9rem] text-red-500">{error}</p>
        )}

        {stats && !loading && (
          <>
            {/* Stat cards */}
            <section className="grid grid-cols-2 gap-4 max-w-[520px] mb-4 max-[480px]:grid-cols-1">
              <StatCard label="Total Leads" value={stats.totalLeads} accent="var(--teal)" />
              <StatCard label="Today's Leads" value={stats.todayLeads} accent="var(--orange)" />
            </section>

            {/* Status breakdown */}
            <section className="grid grid-cols-4 gap-4 mb-8 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
              <StatCard label="New" value={stats.newLeads} accent="#3B82F6" />
              <StatCard label="Contacted" value={stats.contactedLeads} accent="var(--orange)" />
              <StatCard label="Qualified" value={stats.qualifiedLeads} accent="#8B5CF6" />
              <StatCard label="Closed" value={stats.closedLeads} accent="var(--teal)" />
            </section>

            {/* Latest leads */}
            <section className="bg-white rounded-[14px] shadow-[var(--shadow-sm)] border border-[var(--gray-100)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--gray-100)]">
                <h2 className="text-[1rem] font-bold text-[var(--gray-900)]">
                  Latest Leads
                </h2>
              </div>

              {stats.latestLeads.length === 0 ? (
                <p className="px-5 py-8 text-[0.88rem] text-[var(--gray-500)] text-center">
                  No leads yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--gray-50)] text-[0.72rem] uppercase tracking-[0.05em] text-[var(--gray-400)]">
                        <th className="px-5 py-3 font-semibold">Name</th>
                        <th className="px-5 py-3 font-semibold">Email</th>
                        <th className="px-5 py-3 font-semibold">Phone</th>
                        <th className="px-5 py-3 font-semibold">ZIP</th>
                        <th className="px-5 py-3 font-semibold">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.latestLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="border-t border-[var(--gray-100)] text-[0.85rem] text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                        >
                          <td className="px-5 py-3 font-medium text-[var(--gray-900)]">{lead.name}</td>
                          <td className="px-5 py-3">{lead.email}</td>
                          <td className="px-5 py-3">{lead.phone}</td>
                          <td className="px-5 py-3">{lead.zipCode}</td>
                          <td className="px-5 py-3 whitespace-nowrap text-[var(--gray-500)]">
                            {formatDate(lead.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

function StatCard({ label, value, accent, accentBg, icon }) {
  return (
    <div className="group bg-white rounded-[18px] p-8 shadow-[var(--shadow-sm)] border border-[var(--gray-100)] flex flex-col items-center text-center [transition:border-color_0.18s,box-shadow_0.18s,transform_0.18s] hover:-translate-y-0.5 hover:shadow-[var(--shadow)] hover:border-[var(--gray-200)] max-[480px]:p-6">
      <span
        className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-4 shrink-0"
        style={{ background: accentBg, color: accent }}
      >
        {icon}
      </span>
      <p
        className="text-[3rem] leading-none font-black text-[var(--gray-900)] max-[480px]:text-[2.4rem]"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="text-[0.8rem] font-semibold text-[var(--gray-400)] uppercase tracking-[0.08em] mt-2">
        {label}
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

      <main className="flex-1 p-8 max-[768px]:p-5 flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-[1.6rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em]">
            Dashboard
          </h1>
          <p className="text-[0.88rem] text-[var(--gray-500)] mt-1">
            A quick overview of your CRM totals.
          </p>
        </header>

        {loading && (
          <p className="text-[0.9rem] text-[var(--gray-500)]">Loading...</p>
        )}

        {error && !loading && (
          <p className="text-[0.9rem] text-red-500">{error}</p>
        )}

        {stats && !loading && (
          <section className="grid grid-cols-2 gap-6 w-full max-w-[640px] mx-auto max-[480px]:grid-cols-1">
            <StatCard
              label="Total Leads"
              value={stats.totalLeads}
              accent="var(--teal)"
              accentBg="var(--teal-light)"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
            />
            <StatCard
              label="Total Contacts"
              value={stats.totalContacts ?? 0}
              accent="var(--orange)"
              accentBg="#FFF7ED"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
            />
          </section>
        )}
      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import LeadDetailModal from "@/components/LeadDetailModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

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

const LIMIT = 10;

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // `searchInput` is what the user types; `search` is the debounced value we query with.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filters. status/city/state are exact-match; dates are an inclusive range.
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    state: "",
    fromDate: "",
    toDate: "",
  });

  // Distinct city/state values for the filter dropdowns.
  const [options, setOptions] = useState({ cities: [], states: [] });

  // Id of the lead whose details modal is open (null = closed).
  const [selectedId, setSelectedId] = useState(null);

  // Id of the lead whose status is currently being saved (null = none).
  const [updatingId, setUpdatingId] = useState(null);

  // CSV export in progress.
  const [exporting, setExporting] = useState(false);

  // Delete flow state.
  const [deleteId, setDeleteId] = useState(null); // lead pending deletion (null = closed)
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statusError, setStatusError] = useState(""); // transient status-update error

  // Bumped after a successful delete to force the list to reload.
  const [reloadKey, setReloadKey] = useState(0);

  // Load distinct city/state options for the dropdowns once.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/leads/options")
      .then((res) => (res.ok ? res.json() : { cities: [], states: [] }))
      .then((data) => {
        if (!cancelled) setOptions(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce the search box so we don't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1); // reset to first page on a new search
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });
    if (search) params.set("search", search);
    if (filters.status) params.set("status", filters.status);
    if (filters.city) params.set("city", filters.city);
    if (filters.state) params.set("state", filters.state);
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);

    fetch(`/api/leads?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setLeads(data.leads);
        setPagination(data.pagination);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load leads.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, reloadKey, filters]);

  // Changing a filter resets back to the first page.
  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ status: "", city: "", state: "", fromDate: "", toDate: "" });
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    !!search ||
    !!filters.status ||
    !!filters.city ||
    !!filters.state ||
    !!filters.fromDate ||
    !!filters.toDate;

  const canPrev = pagination.page > 1;
  const canNext = pagination.page < pagination.totalPages;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/leads/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setDeleteId(null);
      setSuccessMessage("Lead deleted successfully.");
      // If we just removed the last row on a page beyond the first, step back.
      if (leads.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setReloadKey((k) => k + 1);
      }
    } catch {
      setDeleteError("Couldn't delete the lead. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    setStatusError("");

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();

      // Update the row in place with the value the server confirmed.
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: updated.status } : l))
      );
      setSuccessMessage("Status updated successfully.");
      // The dashboard refetches its stats whenever it mounts, so the new
      // status counts are reflected the next time it's opened.
    } catch {
      setStatusError("Couldn't update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setStatusError("");

    // Export honours the same active search + filters as the table.
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.status) params.set("status", filters.status);
    if (filters.city) params.set("city", filters.city);
    if (filters.state) params.set("state", filters.state);
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);

    try {
      const res = await fetch(`/api/leads/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${today}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setStatusError("Couldn't export leads. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Auto-dismiss the success / status-error messages after a few seconds.
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  useEffect(() => {
    if (!statusError) return;
    const t = setTimeout(() => setStatusError(""), 4000);
    return () => clearTimeout(t);
  }, [statusError]);

  return (
    <div className="flex min-h-screen bg-[var(--gray-50)]">
      <AdminSidebar />

      <main className="flex-1 p-8 max-[768px]:p-5 overflow-x-auto">
        <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[1.6rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em]">
              Leads
            </h1>
            <p className="text-[0.88rem] text-[var(--gray-500)] mt-1">
              {pagination.total} total {pagination.total === 1 ? "lead" : "leads"}
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-[0.85rem] top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="2" />
                <path d="M21 21l-4.3-4.3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search name, email, phone, ZIP..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-[280px] max-[480px]:w-full py-[0.6rem] pr-[0.85rem] pl-[2.4rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.85rem] text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)] focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)] placeholder:text-[var(--gray-400)]"
            />
          </div>
        </header>

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-[10px] bg-[var(--teal-light)] text-[var(--teal-dark)] text-[0.85rem] font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {successMessage}
          </div>
        )}

        {statusError && (
          <div className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 text-red-600 text-[0.85rem] font-medium">
            {statusError}
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white rounded-[14px] shadow-[var(--shadow-sm)] border border-[var(--gray-100)] p-4 mb-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-[var(--gray-400)]">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="min-w-[140px] py-[0.55rem] px-[0.7rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.85rem] text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)]"
            >
              <option value="">All</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-[var(--gray-400)]">City</label>
            <select
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="min-w-[140px] py-[0.55rem] px-[0.7rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.85rem] text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)]"
            >
              <option value="">All</option>
              {options.cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-[var(--gray-400)]">State</label>
            <select
              value={filters.state}
              onChange={(e) => updateFilter("state", e.target.value)}
              className="min-w-[140px] py-[0.55rem] px-[0.7rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.85rem] text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)]"
            >
              <option value="">All</option>
              {options.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-[var(--gray-400)]">From</label>
            <input
              type="date"
              value={filters.fromDate}
              max={filters.toDate || undefined}
              onChange={(e) => updateFilter("fromDate", e.target.value)}
              className="py-[0.5rem] px-[0.7rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.85rem] text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-[var(--gray-400)]">To</label>
            <input
              type="date"
              value={filters.toDate}
              min={filters.fromDate || undefined}
              onChange={(e) => updateFilter("toDate", e.target.value)}
              className="py-[0.5rem] px-[0.7rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.85rem] text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)]"
            />
          </div>

          <div className="ml-auto flex items-end gap-2">
            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="py-[0.55rem] px-4 rounded-[8px] text-[0.85rem] font-semibold border border-[var(--gray-200)] bg-white text-[var(--gray-700)] hover:bg-[var(--gray-50)] disabled:opacity-40 disabled:cursor-not-allowed [transition:background_0.15s]"
            >
              Reset Filters
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="py-[0.55rem] px-4 rounded-[8px] text-[0.85rem] font-semibold text-white bg-[var(--teal)] hover:bg-[var(--teal-dark)] disabled:opacity-60 disabled:cursor-not-allowed [transition:background_0.15s] flex items-center gap-2"
            >
              {exporting ? (
                "Exporting..."
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>

        <section className="bg-white rounded-[14px] shadow-[var(--shadow-sm)] border border-[var(--gray-100)] overflow-hidden">
          {loading ? (
            <p className="px-5 py-10 text-[0.9rem] text-[var(--gray-500)] text-center">
              Loading...
            </p>
          ) : error ? (
            <p className="px-5 py-10 text-[0.9rem] text-red-500 text-center">{error}</p>
          ) : leads.length === 0 ? (
            <p className="px-5 py-10 text-[0.9rem] text-[var(--gray-500)] text-center">
              {search ? "No leads match your search." : "No leads yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--gray-50)] text-[0.72rem] uppercase tracking-[0.05em] text-[var(--gray-400)]">
                    <th className="px-5 py-3 font-semibold">ZIP</th>
                    <th className="px-5 py-3 font-semibold">City</th>
                    <th className="px-5 py-3 font-semibold">State</th>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-[var(--gray-100)] text-[0.85rem] text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                    >
                      <td className="px-5 py-3">{lead.zipCode}</td>
                      <td className="px-5 py-3">{lead.city || "—"}</td>
                      <td className="px-5 py-3">{lead.state || "—"}</td>
                      <td className="px-5 py-3 font-medium text-[var(--gray-900)]">{lead.name}</td>
                      <td className="px-5 py-3">{lead.email}</td>
                      <td className="px-5 py-3">{lead.phone}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="py-[0.35rem] pl-[0.6rem] pr-[0.5rem] border-[1.5px] border-[var(--gray-200)] rounded-[6px] text-[0.8rem] font-semibold text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)] disabled:opacity-50 disabled:cursor-wait cursor-pointer"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-[var(--gray-500)]">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedId(lead.id)}
                          className="px-3 py-[0.4rem] rounded-[6px] text-[0.8rem] font-semibold text-[var(--teal)] border border-[var(--teal)] hover:bg-[var(--teal)] hover:text-white [transition:background_0.15s,color_0.15s]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setDeleteError("");
                            setDeleteId(lead.id);
                          }}
                          className="px-3 py-[0.4rem] rounded-[6px] text-[0.8rem] font-semibold text-red-500 border border-red-300 hover:bg-red-500 hover:text-white hover:border-red-500 [transition:background_0.15s,color_0.15s]"
                        >
                          Delete
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pagination controls */}
        {!loading && !error && leads.length > 0 && (
          <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
            <p className="text-[0.8rem] text-[var(--gray-500)]">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
                className="px-4 py-2 rounded-[8px] text-[0.85rem] font-medium border border-[var(--gray-200)] bg-white text-[var(--gray-700)] hover:bg-[var(--gray-50)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!canNext}
                className="px-4 py-2 rounded-[8px] text-[0.85rem] font-medium border border-[var(--gray-200)] bg-white text-[var(--gray-700)] hover:bg-[var(--gray-50)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {selectedId && (
        <LeadDetailModal leadId={selectedId} onClose={() => setSelectedId(null)} />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          loading={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

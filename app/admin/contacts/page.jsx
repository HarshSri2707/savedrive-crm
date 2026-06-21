"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import ContactDetailModal from "@/components/ContactDetailModal";
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

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // `searchInput` is what the user types; `search` is the debounced value we query with.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Date range filters.
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });

  // Id of the contact whose details modal is open (null = closed).
  const [selectedId, setSelectedId] = useState(null);

  // Delete flow state.
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // CSV export in progress.
  const [exporting, setExporting] = useState(false);

  // Bumped after a successful delete to force the list to reload.
  const [reloadKey, setReloadKey] = useState(0);

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
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);

    fetch(`/api/contacts?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setContacts(data.contacts);
        setPagination(data.pagination);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load contacts.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, filters, reloadKey]);

  // Changing a date filter resets back to the first page.
  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ fromDate: "", toDate: "" });
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    !!search || !!filters.fromDate || !!filters.toDate;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/contacts/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setDeleteId(null);
      setSuccessMessage("Contact deleted successfully.");
      // If we just removed the last row on a page beyond the first, step back.
      if (contacts.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setReloadKey((k) => k + 1);
      }
    } catch {
      setDeleteError("Couldn't delete the contact. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setActionError("");

    // Export honours the same active search + date filters as the table.
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);

    try {
      const res = await fetch(`/api/contacts/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contacts-${today}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setActionError("Couldn't export contacts. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Auto-dismiss the transient banners.
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  useEffect(() => {
    if (!actionError) return;
    const t = setTimeout(() => setActionError(""), 4000);
    return () => clearTimeout(t);
  }, [actionError]);

  const canPrev = pagination.page > 1;
  const canNext = pagination.page < pagination.totalPages;

  return (
    <div className="flex min-h-screen bg-[var(--gray-50)]">
      <AdminSidebar />

      <main className="flex-1 p-8 max-[768px]:p-5 overflow-x-auto">
        <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[1.6rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em]">
              Contacts
            </h1>
            <p className="text-[0.88rem] text-[var(--gray-500)] mt-1">
              {pagination.total} total {pagination.total === 1 ? "message" : "messages"}
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
              placeholder="Search name, email, phone, message..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-[290px] max-[480px]:w-full py-[0.6rem] pr-[0.85rem] pl-[2.4rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.85rem] text-[var(--gray-800)] bg-white outline-none focus:border-[var(--teal)] focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)] placeholder:text-[var(--gray-400)]"
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

        {actionError && (
          <div className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 text-red-600 text-[0.85rem] font-medium">
            {actionError}
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white rounded-[14px] shadow-[var(--shadow-sm)] border border-[var(--gray-100)] p-4 mb-4 flex flex-wrap items-end gap-3">
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
          ) : contacts.length === 0 ? (
            <p className="px-5 py-10 text-[0.9rem] text-[var(--gray-500)] text-center">
              {hasActiveFilters ? "No contacts match your filters." : "No contact messages yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--gray-50)] text-[0.72rem] uppercase tracking-[0.05em] text-[var(--gray-400)]">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-[var(--gray-100)] text-[0.85rem] text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                    >
                      <td className="px-5 py-3 font-medium text-[var(--gray-900)]">{c.name}</td>
                      <td className="px-5 py-3">{c.email}</td>
                      <td className="px-5 py-3">{c.phone || "—"}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-[var(--gray-500)]">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedId(c.id)}
                            className="px-3 py-[0.4rem] rounded-[6px] text-[0.8rem] font-semibold text-[var(--teal)] border border-[var(--teal)] hover:bg-[var(--teal)] hover:text-white [transition:background_0.15s,color_0.15s]"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setDeleteError("");
                              setDeleteId(c.id);
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
        {!loading && !error && contacts.length > 0 && (
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
        <ContactDetailModal contactId={selectedId} onClose={() => setSelectedId(null)} />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          loading={deleting}
          error={deleteError}
          title="Delete Contact"
          message="Are you sure you want to delete this contact?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

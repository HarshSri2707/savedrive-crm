"use client";
import { useEffect, useState } from "react";

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

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-[0.15rem]">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-[var(--gray-400)]">
        {label}
      </span>
      <span className="text-[0.92rem] text-[var(--gray-800)] break-words">
        {value || "—"}
      </span>
    </div>
  );
}

export default function ContactDetailModal({ contactId, onClose }) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Close on ESC.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Fetch the contact's full details.
  useEffect(() => {
    if (!contactId) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(`/api/contacts/${contactId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setContact(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load contact details.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [contactId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Stop propagation so clicks inside the card don't close the modal */}
      <div
        className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto bg-white rounded-[16px] shadow-[var(--shadow-xl)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h2 className="text-[1.15rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em]">
            Contact Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--gray-500)] hover:bg-[var(--gray-100)] [transition:background_0.15s]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-[0.9rem] text-[var(--gray-500)]">Loading...</p>
        ) : error ? (
          <p className="py-8 text-center text-[0.9rem] text-red-500">{error}</p>
        ) : contact ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={contact.name} />
              <Field label="Phone" value={contact.phone} />
              <Field label="Email" value={contact.email} />
              <Field label="Created Date" value={formatDate(contact.createdAt)} />
            </div>

            <Field label="Message" value={contact.message} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

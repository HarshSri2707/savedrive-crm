"use client";
import { useEffect } from "react";

// Licensed insurance partners shown in the "trusted third parties" disclosure.
const PARTNERS = [
  "Progressive Insurance",
  "Geico",
  "State Farm",
  "Allstate Insurance",
  "Liberty Mutual",
  "Nationwide",
  "Farmers Insurance",
  "Travelers",
  "American Family Insurance",
  "Erie Insurance",
  "The Hartford",
  "USAA",
  "21st Century Insurance",
  "Dairyland Auto",
  "SafeAuto",
  "Infinity Auto Insurance",
  "AssureStart",
  "Bristol West",
];

export default function PartnersModal({ open, onClose }) {
  // Close on Escape. No body-scroll lock — the panel is scoped to the form card,
  // so the page must never scroll-jump or reset when it opens/closes.
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Absolute overlay scoped to the Hero form card (its positioned parent), so
    // this reads as an extended panel of the form — not a site-wide popup.
    // Clicking the backdrop area (outside the inner panel) closes it.
    <div
      className="absolute inset-0 z-[40] flex p-2 bg-black/45 backdrop-blur-[2px] rounded-[20px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="partners-modal-title"
    >
      {/* White rounded panel — stop propagation so inside clicks don't close it. */}
      <div
        className="bg-white rounded-[14px] w-full max-h-full m-auto flex flex-col shadow-[var(--shadow-lg)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3 shrink-0">
          <h2
            id="partners-modal-title"
            className="text-[1.25rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] leading-[1.25]"
          >
            Our Insurance Partner Network
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-[var(--gray-400)] hover:text-[var(--gray-700)] [transition:color_0.15s] -mr-1 -mt-1 p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="px-6 text-[0.82rem] text-[var(--gray-500)] leading-[1.65] shrink-0">
          When you submit a quote request, your information may be shared with
          one or more of the following licensed insurance companies or their
          authorized agents. This list is updated whenever new partners are added.
        </p>

        {/* Scrollable partner list */}
        <div className="px-6 py-4 overflow-y-auto flex flex-col gap-[0.55rem]">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 bg-[#F4F8F8] rounded-full py-[0.7rem] px-[1.05rem]"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--teal)] shrink-0" />
              <span className="text-[0.9rem] text-[var(--gray-800)] font-medium">{name}</span>
            </div>
          ))}
        </div>

        {/* Footer + action */}
        <div className="px-6 pb-6 pt-2 shrink-0">
          <p className="text-[0.78rem] text-[var(--gray-400)] leading-[1.6] mb-4">
            Last updated: June 2024. SaveDriveQuotes is an independent lead
            marketplace, not a licensed insurer or agent. See our{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--teal)] underline font-medium"
            >
              Privacy Policy
            </a>{" "}
            for full data-sharing details.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-[0.95rem] rounded-full bg-[var(--teal)] text-white text-[0.98rem] font-bold [transition:background_0.2s] hover:bg-[var(--teal-dark)]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

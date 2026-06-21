"use client";
import { useEffect } from "react";

export default function ConfirmDeleteModal({
  onConfirm,
  onCancel,
  loading,
  error,
  title = "Delete Lead",
  message = "Are you sure you want to delete this lead?",
}) {
  // Close on ESC (unless a delete is in flight).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel, loading]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={() => !loading && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[380px] bg-white rounded-[16px] shadow-[var(--shadow-xl)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[1.15rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-2">
          {title}
        </h2>
        <p className="text-[0.9rem] text-[var(--gray-500)] leading-[1.6] mb-1">
          {message}
        </p>

        {error && (
          <p className="text-[0.8rem] text-red-500 mt-2">{error}</p>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-[8px] text-[0.85rem] font-semibold border border-[var(--gray-200)] bg-white text-[var(--gray-700)] hover:bg-[var(--gray-50)] disabled:opacity-50 [transition:background_0.15s]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-[8px] text-[0.85rem] font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed [transition:background_0.15s]"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

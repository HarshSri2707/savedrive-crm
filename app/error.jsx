"use client";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <main className="min-h-screen bg-[#0B2537] flex items-center justify-center px-6 text-center">
      <div className="max-w-[480px]">
        <div className="w-[64px] h-[64px] rounded-full bg-[rgba(249,115,22,0.16)] text-[var(--orange)] flex items-center justify-center mx-auto mb-5">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-white text-[clamp(1.3rem,4vw,1.7rem)] font-extrabold tracking-[-0.02em] mb-3">
          Something went wrong
        </h1>
        <p className="text-white/[0.6] text-[0.95rem] leading-[1.7] mb-8">
          An unexpected error occurred. You can try again, or head back to the
          homepage.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-bold text-[0.95rem] py-[0.85rem] px-7 rounded-full shadow-[0_4px_18px_rgba(249,115,22,0.38)] cursor-pointer [transition:background_0.2s,transform_0.15s] hover:bg-[var(--orange-dark)] hover:-translate-y-px"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[var(--teal)] text-[var(--teal)] font-bold text-[0.95rem] py-[0.85rem] px-7 rounded-full no-underline [transition:background_0.2s,color_0.2s] hover:bg-[var(--teal)] hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

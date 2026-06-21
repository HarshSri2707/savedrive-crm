import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0B2537] flex items-center justify-center px-6 text-center">
      <div className="max-w-[480px]">
        <p className="text-[var(--teal)] font-black text-[clamp(4rem,12vw,6rem)] leading-none tracking-[-0.04em]">
          404
        </p>
        <h1 className="text-white text-[clamp(1.3rem,4vw,1.7rem)] font-extrabold tracking-[-0.02em] mt-3 mb-3">
          Page not found
        </h1>
        <p className="text-white/[0.6] text-[0.95rem] leading-[1.7] mb-8">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
          Let&rsquo;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-bold text-[0.95rem] py-[0.85rem] px-7 rounded-full shadow-[0_4px_18px_rgba(249,115,22,0.38)] no-underline [transition:background_0.2s,transform_0.15s] hover:bg-[var(--orange-dark)] hover:-translate-y-px"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

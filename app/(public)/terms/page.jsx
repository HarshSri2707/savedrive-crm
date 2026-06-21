import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Terms of Service",
  description:
    "Review the SaveDriveQuotes Terms of Service. SaveDriveQuotes is an independent insurance comparison marketplace, not a licensed insurer.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | SaveDriveQuotes",
    description: "The terms governing your use of the SaveDriveQuotes marketplace.",
    url: `${SITE_URL}/terms`,
  },
  twitter: {
    title: "Terms of Service | SaveDriveQuotes",
    description: "The terms governing your use of the SaveDriveQuotes marketplace.",
  },
};

export default function TermsPage() {
  return (
    <main className="bg-[#0B2537] min-h-screen pt-[7rem] pb-20 max-[860px]:pt-24">
      <div className="w-full max-w-[800px] mx-auto px-6 max-[768px]:px-4">
        <span className="inline-block text-[0.72rem] font-bold tracking-[0.1em] uppercase text-[var(--teal)] mb-3">
          Legal
        </span>
        <h1 className="text-white text-[clamp(2rem,4vw,3rem)] font-black tracking-[-0.03em] leading-[1.1] mb-4">
          Terms of Service
        </h1>
        <p className="text-white/[0.6] text-[0.95rem] leading-[1.8] mb-5">
          By using SaveDriveQuotes you agree to these terms. SaveDriveQuotes is an
          independent insurance comparison marketplace and lead-generation
          service. We are not a licensed insurance company, agent, or broker, and
          we do not sell insurance policies directly. Quoted rates are estimates
          only and are not a guarantee of final pricing.
        </p>
        <p className="text-white/[0.6] text-[0.95rem] leading-[1.8] mb-8">
          The full terms are being finalized. If you have any questions in the
          meantime, please reach out through our contact page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-bold text-[0.9rem] py-[0.7rem] px-6 rounded-full shadow-[0_4px_18px_rgba(249,115,22,0.38)] no-underline [transition:background_0.2s,transform_0.15s] hover:bg-[var(--orange-dark)] hover:-translate-y-px"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

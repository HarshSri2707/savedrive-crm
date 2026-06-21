import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Read the SaveDriveQuotes Privacy Policy to learn how we collect, use, and protect the information you share when requesting insurance quotes.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | SaveDriveQuotes",
    description: "How SaveDriveQuotes collects, uses, and protects your information.",
    url: `${SITE_URL}/privacy`,
  },
  twitter: {
    title: "Privacy Policy | SaveDriveQuotes",
    description: "How SaveDriveQuotes collects, uses, and protects your information.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#0B2537] min-h-screen pt-[7rem] pb-20 max-[860px]:pt-24">
      <div className="w-full max-w-[800px] mx-auto px-6 max-[768px]:px-4">
        <span className="inline-block text-[0.72rem] font-bold tracking-[0.1em] uppercase text-[var(--teal)] mb-3">
          Legal
        </span>
        <h1 className="text-white text-[clamp(2rem,4vw,3rem)] font-black tracking-[-0.03em] leading-[1.1] mb-4">
          Privacy Policy
        </h1>
        <p className="text-white/[0.6] text-[0.95rem] leading-[1.8] mb-5">
          SaveDriveQuotes respects your privacy. This page describes how we
          collect, use, and protect the information you share with us when you
          request insurance quotes or contact our team. We only use your details
          to match you with relevant insurance partners and to respond to your
          requests.
        </p>
        <p className="text-white/[0.6] text-[0.95rem] leading-[1.8] mb-8">
          The full policy is being finalized. If you have any questions about how
          your data is handled in the meantime, please reach out through our
          contact page and we&rsquo;ll be happy to help.
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

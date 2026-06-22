
import Link from "next/link";

export default function Footer({ data, site }) {
  return (
    <footer className="bg-[#0A1E2E]">
      <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4 grid grid-cols-[260px_1fr] gap-12 pt-14 pb-12 max-[900px]:grid-cols-[1fr] max-[900px]:gap-8">

        {/* Brand col */}
        <div className="flex flex-col gap-[0.85rem]">
          <div className="flex items-center gap-[0.45rem]">
            <span className="w-[30px] h-[30px] bg-[var(--teal)] rounded-[7px] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[1.1rem] font-extrabold tracking-[-0.02em]">
              <span className="text-white">Smart </span>
              <span className="text-[var(--teal)]">Cover </span>
              <span className="text-white">Auto</span>
            </span>
          </div>
          <p className="text-[0.82rem] text-white/[0.45] leading-[1.65] max-w-[220px]">{site.tagline}</p>
        </div>

        {/* Link columns - Sirf Legal section */}
        <div className="grid grid-cols-1 gap-8 max-[600px]:grid-cols-1">
          <div className="flex flex-col gap-[0.55rem]">
            <h4 className="text-white text-[0.82rem] font-bold mb-[0.3rem]">Legal</h4>
            {data.legal.map((l, i) => (
              <Link key={i} href={l.href} className={`text-[0.8rem] leading-[1.5] [transition:color_0.2s] ${l.highlight ? "text-[var(--orange)] hover:text-[var(--orange-dark)]" : "text-white/[0.45] hover:text-white/[0.9]"}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Do Not Sell My Info (CCPA) - Full width line */}
      <div className="border-t border-t-white/[0.06] py-[0.8rem]">
        <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
          <a href="#" className="text-[0.85rem] text-[var(--orange)] hover:text-[var(--orange-dark)] [transition:color_0.2s]">
            Do Not Sell My Info (CCPA)
          </a>
        </div>
      </div>

      {/* Brand Logos Disclosure */}
      <div className="border-t border-t-white/[0.06] py-[0.8rem]">
        <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
          <p className="text-[0.78rem] text-white/[0.3] leading-[1.6]">
            <strong className="text-white/[0.4] font-semibold">Note: </strong>
            &quot;All Brand Logos Displayed Are The Property Of Their Respective Owners And Are Used For Identification Purposes Only&quot;
          </p>
        </div>
      </div>

      {/* Independent Marketplace Disclosure */}
      <div className="border-t border-t-white/[0.06] py-[0.8rem]">
        <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
          <p className="text-[0.73rem] text-white/[0.28] leading-[1.65]">
            <strong className="text-white/[0.4] font-semibold">Independent Marketplace Disclosure: </strong>
            {data.disclosure}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-t-white/[0.06] py-[1.1rem]">
        <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4 flex items-center justify-between flex-wrap gap-3 max-[600px]:flex-col max-[600px]:items-start">
          <p className="text-[0.75rem] text-white/[0.3]">{data.copyright}</p>
          <div className="flex gap-5 flex-wrap">
            <Link href="/privacy" className="text-[0.75rem] text-white/[0.4] [transition:color_0.2s] hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-[0.75rem] text-white/[0.4] [transition:color_0.2s] hover:text-white">Terms of Service</Link>
            <a href="#" className="text-[0.75rem] [transition:color_0.2s] text-[var(--orange)]">Do Not Sell My Info (CCPA)</a>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-[0.3rem] text-[0.72rem] text-white/[0.3]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
              </svg>
              SSL Secured
            </span>
            <span className="flex items-center gap-[0.3rem] text-[0.72rem] text-white/[0.3]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Not a Direct Insurer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
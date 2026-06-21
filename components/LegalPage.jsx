import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import content from "@/data/content.json";

export default function LegalPage({ title, subtitle, lastRevised, children }) {
  return (
    <>
     
      <main>
        {/* Header */}
        <header className="bg-[var(--navy)] pt-[7.5rem] pb-12 max-[768px]:pt-[6.5rem]">
          <div className="w-full max-w-7xl mx-auto px-6 max-[768px]:px-4">
            <h1 className="text-white text-[2.2rem] font-extrabold tracking-[-0.02em] max-[768px]:text-[1.7rem]">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-white/[0.6] text-[0.95rem] mt-2 leading-[1.6]">{subtitle}</p>
            ) : null}
            {lastRevised ? (
              <p className="text-[var(--teal-light)] text-[0.82rem] font-medium mt-3">
                Last revised: {lastRevised}
              </p>
            ) : null}
          </div>
        </header>

        {/* Body */}
        <article className="w-full max-w-7xl mx-auto px-6 max-[768px]:px-4 py-14 max-[768px]:py-10">
          <div className="legal-prose">{children}</div>
        </article>
      </main>
     
    </>
  );
}
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import content from "@/data/content.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

// Reuse the homepage headline copy, but drop the trailing "&" and the savings
// line, and colour "Auto Insurance" teal with a line break — matching the design.
function renderTealHeadline(text) {
  const clean = (text || "").replace(/\s*&\s*$/, "");
  const HL = "Auto Insurance";
  const idx = clean.indexOf(HL);
  if (idx === -1) return clean;
  return (
    <>
      {clean.slice(0, idx).trimEnd()}
      <br />
      <span className="text-[#2DD4BF]">{HL}</span>
      {clean.slice(idx + HL.length)}
    </>
  );
}

export default function ContactPage() {
  const { hero, site, footer } = content;

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  // Placeholder submit — intentionally NOT connected to the CRM/lead API.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full py-[0.85rem] px-[1rem] border-[1.5px] border-[var(--gray-200)] rounded-[10px] text-[0.88rem] text-[var(--gray-800)] bg-[#FAFAFA] outline-none [transition:border-color_0.2s,box-shadow_0.2s,background_0.2s] focus:border-[var(--teal)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)] placeholder:text-[var(--gray-400)]";

  return (
    <>
      <Navbar site={site} />

      <main>
        <section className="relative min-h-screen bg-[#0B2537] flex items-center pt-[7rem] pb-16 overflow-hidden max-[860px]:pt-24 max-[860px]:pb-12">
          {/* Background image — kept light so the vehicles stay visible */}
          <img
            src="/images/BG.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-[0.78]"
          />
          {/* Subtle overlay only — gently darker on the left for legibility, lighter on the right so the vehicles stay clearly visible */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0B2537]/55 via-[#0B2537]/28 to-[#0B2537]/16" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_18%_42%,rgba(13,148,136,0.1)_0%,transparent_55%)]" />

          <div className="w-full max-w-[78rem] mx-auto px-6 max-[768px]:px-4 grid grid-cols-[1.2fr_0.95fr] gap-16 items-start relative z-[1] max-[1060px]:gap-10 max-[860px]:grid-cols-[1fr] max-[860px]:gap-8">

            {/* ── Left ── */}
            <div className="flex flex-col">
              <motion.h1
                className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-black text-white tracking-[-0.03em] leading-[1.08] mb-[1rem] max-[480px]:text-[2rem]"
                {...fadeUp(0.05)}
              >
                Contact US
              </motion.h1>

              <motion.p
                className="text-white/[0.72] text-[0.97rem] leading-[1.7] mb-[1.6rem] max-w-[440px] max-[860px]:max-w-full"
                {...fadeUp(0.12)}
              >
                &ldquo;Have questions or need assistance? Our team is here to help.
                Get in touch with us, and we&rsquo;ll be happy to support you with
                the right information and solutions.&rdquo;
              </motion.p>

              <motion.h2
                className="text-[clamp(1.8rem,3.4vw,2.7rem)] font-black text-white leading-[1.1] tracking-[-0.03em] mb-[1.4rem] max-[480px]:text-[1.7rem]"
                {...fadeUp(0.18)}
              >
                {renderTealHeadline(hero.headline1)}
              </motion.h2>

              <motion.p
                className="text-white/55 text-[0.9rem] font-semibold mb-[0.85rem]"
                {...fadeUp(0.24)}
              >
                Why Choose {site.name}?
              </motion.p>

              <motion.ul className="flex flex-col gap-[0.55rem] mb-[1.75rem]" {...fadeUp(0.3)}>
                {hero.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-[0.65rem] text-white/[0.82] text-[0.93rem] font-medium">
                    <span className="w-5 h-5 bg-[var(--teal)] rounded-full flex items-center justify-center shrink-0">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </motion.ul>

              <motion.div className="flex gap-3 flex-wrap max-[480px]:gap-[0.5rem]" {...fadeUp(0.36)}>
                {hero.stats.map((s, i) => (
                  <div key={i} className="bg-white/[0.07] border border-white/[0.1] rounded-[8px] py-[0.5rem] px-[0.95rem] flex flex-col items-center min-w-[82px] max-[480px]:min-w-[74px]">
                    <span className="text-[1.15rem] font-black text-white leading-[1.2] max-[480px]:text-[1rem]">{s.value}</span>
                    <span className="text-[0.62rem] text-white/[0.45] mt-[0.05rem] text-center">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right (Contact form) ── */}
            <motion.div
              className="bg-white rounded-[20px] p-8 shadow-[var(--shadow-xl)] w-full max-w-[470px] ml-auto max-[860px]:max-w-[520px] max-[860px]:mx-auto max-[860px]:mt-6 max-[480px]:p-6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-[1.4rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-5">
                Fill this form to contact us
              </h2>

              {submitted ? (
                <motion.div
                  className="text-center pt-6 pb-4 px-2"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-[56px] h-[56px] bg-[var(--teal)] rounded-full text-white text-[1.6rem] flex items-center justify-center mx-auto mb-4">✓</div>
                  <h3 className="text-[1.1rem] font-bold mb-[0.4rem] text-[var(--gray-900)]">Thanks for reaching out!</h3>
                  <p className="text-[0.88rem] text-[var(--gray-500)]">We&rsquo;ll get back to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-[0.85rem]">
                  <input
                    type="text" placeholder="Full Name" required
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    type="email" placeholder="Email Address" required
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    type="tel" placeholder="Phone Number" required
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <textarea
                    placeholder="Write your message" required rows={4}
                    className={`${inputClass} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />

                  <button
                    type="submit"
                    className="w-full py-[0.9rem] px-4 rounded-[10px] text-white text-[0.95rem] font-bold flex items-center justify-center gap-2 bg-[var(--gray-300)] cursor-pointer [transition:background_0.2s,transform_0.15s] hover:bg-[var(--gray-400)] active:translate-y-px"
                  >
                    Submit
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <p className="flex items-center justify-center gap-[0.3rem] text-[0.72rem] text-[var(--gray-400)] text-center mt-[0.1rem]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        stroke="#9CA3AF" strokeWidth="2" />
                    </svg>
                    {hero.form.trust}
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer data={footer} site={site} />
    </>
  );
}

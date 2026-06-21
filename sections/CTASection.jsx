"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

// One icon per trust item, matched by index to data.trust
const trustIcons = [
  // SSL Encrypted — padlock
  () => (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  // No Obligation — shield
  () => (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  // Trusted by 2M+ Drivers — check inside circle
  () => (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12l2.3 2.3L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
];

export default function CTASection({ data, site }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative bg-[var(--navy)] py-[5.5rem] overflow-hidden" ref={ref}>
      {/* Background image — shield watermark + glows baked into the asset */}
      <Image
        src="/images/BG1.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover pointer-events-none select-none"
      />
      {/* Overlay keeps the centered text legible over the artwork */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_55%,rgba(11,30,46,0.55)_0%,rgba(11,30,46,0.78)_100%)]" />
      <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
        <div className="relative z-[1] flex flex-col items-center text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-[rgba(13,148,136,0.18)] border border-[rgba(13,148,136,0.36)] text-[#5EEAD4] text-[0.78rem] font-semibold py-[0.38rem] px-4 rounded-full mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="w-[6px] h-[6px] bg-[#5EEAD4] rounded-full animate-[pulse-dot_2s_infinite]" />
            {data.badge}
          </motion.div>

          <motion.h2
            className="text-[clamp(2rem,5vw,3.2rem)] font-black text-white leading-[1.12] tracking-[-0.03em] mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {data.heading1}
            <br />
            <span className="text-[#2DD4BF]">{data.heading2}</span>
          </motion.h2>

          <motion.p
            className="text-[1rem] text-white/[0.62] max-w-[640px] leading-[1.7] mb-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Each sentence on its own line, like the reference */}
            {data.subtext.split(/(?<=\.)\s+/).map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </motion.p>

          <motion.div
            className="flex items-center gap-4 flex-wrap justify-center mb-[1.4rem] max-[480px]:flex-col max-[480px]:w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <a href="#hero-form" className="inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-bold text-[1.02rem] py-[0.95rem] px-[2.25rem] rounded-full tracking-[0.01em] shadow-[0_4px_18px_rgba(249,115,22,0.38)] no-underline [transition:background_0.2s_ease,transform_0.15s_ease,box-shadow_0.2s_ease] hover:bg-[var(--orange-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.45)] active:translate-y-0 max-[480px]:w-full">
              {data.btnPrimary}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
           
          </motion.div>

          <motion.div
            className="flex items-center gap-6 flex-wrap justify-center max-[480px]:gap-[0.8rem]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.38 }}
          >
            {data.trust.map((t, i) => {
              const Icon = trustIcons[i % trustIcons.length];
              return (
              <span key={i} className="flex items-center gap-[0.4rem] text-[0.8rem] text-white/[0.55] font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <Icon />
                </svg>
                {t}
              </span>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

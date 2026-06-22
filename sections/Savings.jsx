


"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Savings({ data }) {
  const [mode, setMode] = useState("monthly");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const mult = mode === "monthly" ? 1 : 12;
  const suffix = mode === "monthly" ? "/mo" : "/yr";
  const currentRate = data.currentRate * mult;

  return (
    <section className="py-20 bg-[#EFF6F6]" ref={ref}>
      <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
        <motion.p
          className="block text-center text-[0.72rem] font-bold tracking-[0.1em] uppercase text-[var(--teal)] mb-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {data.badge}
        </motion.p>
        <motion.h2
          className="text-center text-[clamp(1.6rem,3.5vw,2.3rem)] font-extrabold text-[var(--gray-900)] tracking-[-0.025em] mb-2"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {data.heading}
        </motion.h2>
        <motion.p
          className="text-center text-[var(--gray-500)] text-[0.93rem] mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          {data.subheading}
        </motion.p>

        {/* Toggle */}
        <motion.div
          className="flex w-fit mx-auto mb-10 bg-white rounded-full p-[4px] border-[1.5px] border-[var(--gray-200)] gap-[2px]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <button
            className={`py-[0.48rem] px-[1.4rem] rounded-full text-[0.88rem] font-semibold [transition:all_0.2s] ${
              mode === "monthly"
                ? "bg-white text-[var(--gray-900)] shadow-[0_1px_8px_rgba(0,0,0,0.12)]"
                : "bg-transparent text-[var(--gray-500)]"
            }`}
            onClick={() => setMode("monthly")}
            suppressHydrationWarning
          >
            Monthly
          </button>
          <button
            className={`py-[0.48rem] px-[1.4rem] rounded-full text-[0.88rem] font-semibold [transition:all_0.2s] ${
              mode === "annual"
                ? "bg-white text-[var(--gray-900)] shadow-[0_1px_8px_rgba(0,0,0,0.12)]"
                : "bg-transparent text-[var(--gray-500)]"
            }`}
            onClick={() => setMode("annual")}
            suppressHydrationWarning
          >
            Annual
          </button>
        </motion.div>

        {/* Bars */}
        <div className="flex flex-col gap-[0.7rem] max-w-[740px] mx-auto">
          {/* Current provider */}
          <motion.div
            className="bg-[#F1F5F9] rounded-[12px] py-[0.95rem] px-[1.2rem] flex items-center gap-4 shadow-[var(--shadow-sm)] [transition:background_0.2s]"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <div className="min-w-[130px] flex flex-col gap-[2px] max-[580px]:min-w-[85px]">
              <span className="text-[0.88rem] text-[var(--gray-800)] font-bold whitespace-nowrap max-[580px]:text-[0.8rem]">Your Current Provider</span>
              <span className="text-[0.67rem] text-[var(--gray-400)] font-medium">Current</span>
            </div>
            <div className="flex-1 h-[10px] bg-[var(--gray-100)] rounded-[5px] overflow-hidden">
              <motion.div
                className="h-full rounded-[5px]"
                style={{ background: "var(--gray-300)" }}
                initial={{ width: 0 }}
                animate={inView ? { width: "100%" } : {}}
                transition={{ duration: 0.9, delay: 0.5 }}
              />
            </div>
            <span className="text-[0.92rem] font-bold text-[var(--gray-800)] min-w-[68px] text-right whitespace-nowrap max-[580px]:min-w-[52px] max-[580px]:text-[0.82rem]">
              ${currentRate.toLocaleString()}<span className="text-[0.72rem] font-medium text-[var(--gray-500)]">{suffix}</span>
            </span>
          </motion.div>

          {/* Providers */}
          {data.providers.map((p, i) => {
            const rate = p.monthly * mult;
            const save = currentRate - rate;
            const pct = (rate / currentRate) * 100;
            return (
              <motion.div
                key={i}
                className="bg-white rounded-[12px] py-[0.95rem] px-[1.2rem] flex items-center gap-4 shadow-[var(--shadow-sm)] [transition:background_0.2s]"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.32 + i * 0.08 }}
                whileHover={{ backgroundColor: "#F0FDF9" }}
              >
                <div className="min-w-[130px] flex flex-col gap-[2px] max-[580px]:min-w-[85px]">
                  <span className="text-[0.88rem] text-[var(--gray-800)] font-medium whitespace-nowrap max-[580px]:text-[0.8rem]">{p.name}</span>
                </div>
                <div className="flex-1 h-[10px] bg-[var(--gray-100)] rounded-[5px] overflow-hidden">
                  <motion.div
                    className="h-full rounded-[5px]"
                    style={{ background: "var(--teal)" }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${pct}%` } : {}}
                    transition={{ duration: 0.85, delay: 0.6 + i * 0.1 }}
                  />
                </div>
                <span className="text-[0.92rem] font-bold text-[var(--gray-800)] min-w-[68px] text-right whitespace-nowrap max-[580px]:min-w-[52px] max-[580px]:text-[0.82rem]">
                  ${rate.toLocaleString()}<span className="text-[0.72rem] font-medium text-[var(--gray-500)]">{suffix}</span>
                </span>
                <span className="bg-[var(--orange)] text-white text-[0.72rem] font-bold py-[0.28rem] px-[0.7rem] rounded-full whitespace-nowrap max-[580px]:hidden">
                  Save ${save.toLocaleString()}{suffix}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <a href="#hero-form" className="inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-bold text-[1rem] py-[0.9rem] px-8 rounded-full tracking-[0.01em] shadow-[0_4px_18px_rgba(249,115,22,0.38)] no-underline [transition:background_0.2s_ease,transform_0.15s_ease,box-shadow_0.2s_ease] hover:bg-[var(--orange-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.45)] active:translate-y-0">
            Find My Best Rate
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
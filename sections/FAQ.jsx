"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

function FAQItem({ item, index, inView }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`bg-white rounded-[12px] overflow-hidden border-[1.5px] [transition:border-color_0.2s] ${open ? "border-[var(--teal)]" : "border-[var(--gray-200)]"}`}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.07 }}
    >
      <button
        className="w-full flex items-center justify-between py-[1.05rem] px-[1.4rem] text-[0.92rem] font-semibold text-[var(--gray-900)] text-left gap-4 max-[580px]:py-[0.9rem] max-[580px]:px-[1.1rem] max-[580px]:text-[0.86rem]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        suppressHydrationWarning
      >
        <span>{item.q}</span>
        <motion.span
          className={`shrink-0 flex ${open ? "text-[var(--teal)]" : "text-[var(--gray-400)]"}`}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <p className="px-[1.4rem] pb-[1.1rem] text-[0.87rem] text-[var(--gray-500)] leading-[1.7] max-[580px]:px-[1.1rem] max-[580px]:pb-[0.9rem]">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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
          className="text-center text-[clamp(1.6rem,3.5vw,2.1rem)] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-12"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {data.heading}
        </motion.h2>

        <div className="max-w-[700px] mx-auto flex flex-col gap-[0.7rem]">
          {data.list.map((item, i) => (
            <FAQItem key={i} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
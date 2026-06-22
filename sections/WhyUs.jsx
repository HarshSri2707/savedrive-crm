

"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

function ClockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
      <polyline points="12,6 12,12 16,14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function DollarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
      <path d="M12 6v12M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5"
        stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const iconMap = { clock: ClockIcon, dollar: DollarIcon, shield: ShieldIcon };

export default function WhyUs({ data, stats, reviews }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Auto-rotate the border highlight
  useEffect(() => {
    if (!reviews.list || reviews.list.length === 0) return;

    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviews.list.length);
    }, 3000); // Change border every 3 seconds

    return () => clearInterval(interval);
  }, [reviews.list]);

  return (
    <>
      {/* ── Why Us Cards ── */}
      <section className="pt-20 pb-24 bg-[#EFF6F6]" ref={ref}>
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
            className="text-center  text-[clamp(1.6rem,3.5vw,2.1rem)] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-10"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {data.heading}
          </motion.h2>

          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:max-w-[420px] max-[900px]:mx-auto">
            {data.cards.map((card, i) => {
              const Icon = iconMap[card.iconType];
              return (
                <motion.div
                  key={i}
                  className="bg-white rounded-[12px] py-8 px-6 shadow-[var(--shadow)] [transition:transform_0.2s,box-shadow_0.2s]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  whileHover={{ y: -6, boxShadow: "0 18px 44px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center mb-[1.2rem]" style={{ background: card.iconBg }}>
                    <Icon />
                  </div>
                  <h3 className="text-[1rem] font-bold text-[var(--gray-900)] mb-[0.45rem]">{card.title}</h3>
                  <p className="text-[0.86rem] text-[var(--teal-dark)] leading-[1.65]">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <div className="bg-[var(--navy)] py-12 pt-20">
        <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
          <div className="grid grid-cols-3 gap-8 text-center max-[900px]:gap-6 max-[580px]:grid-cols-1">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className="flex flex-col gap-[0.2rem]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.1 }}
              >
                <span className="text-[clamp(2rem,4vw,2.8rem)] font-black text-white tracking-[-0.02em] leading-[1.1]">{s.value}</span>
                <span className="text-[0.82rem] text-[var(--teal)] font-semibold">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews with Shifting Border ── */}
      <div className="bg-[var(--navy)] pt-4 pb-20">
        <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
          <motion.p
            className="block text-center text-[0.72rem] font-bold tracking-[0.1em] uppercase text-[var(--teal)] mb-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {reviews.badge}
          </motion.p>
          <motion.h2
            className="text-center text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-white tracking-[-0.02em] mb-10"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.48 }}
          >
            {reviews.heading}
          </motion.h2>

          <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[580px]:grid-cols-1 max-[580px]:max-w-[380px] max-[580px]:mx-auto">
            {reviews.list.map((r, i) => (
              <motion.div
                key={i}
                className={`rounded-[12px] p-[1.4rem] relative transition-all duration-500 min-h-[220px] flex flex-col ${
                  i === activeReviewIndex
                    ? "border-2 border-[var(--teal)] bg-[rgba(13,148,136,0.12)] shadow-[0_0_30px_rgba(13,148,136,0.15)]"
                    : "border border-white/[0.09] bg-white/[0.06]"
                }`}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                whileHover={{ 
                  y: -4,
                  borderColor: "rgba(13,148,136,0.6)",
                  backgroundColor: "rgba(13,148,136,0.08)"
                }}
              >
                {/* Glow effect for active card */}
                {i === activeReviewIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-[12px] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: "radial-gradient(circle at 50% 0%, rgba(13,148,136,0.15) 0%, transparent 70%)",
                    }}
                  />
                )}

                <div className="relative z-10 flex flex-col flex-1">
                  <div className="text-[var(--orange)] text-[0.88rem] tracking-[1px] mb-[0.7rem]">
                    {"★".repeat(r.stars)}
                  </div>
                  <p className="text-[0.82rem] text-white/[0.82] leading-[1.65] mb-4 flex-1">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-[0.6rem] mt-auto">
                    <div className="w-[34px] h-[34px] rounded-full text-white text-[0.68rem] font-bold flex items-center justify-center shrink-0" style={{ background: r.avatarBg }}>
                      {r.initials}
                    </div>
                    <div>
                      <div className="text-[0.82rem] font-bold text-white">{r.name}</div>
                      <div className="text-[0.72rem] text-white/[0.45]">{r.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.list.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveReviewIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeReviewIndex 
                    ? 'w-10 bg-[var(--teal)]' 
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to review ${index + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
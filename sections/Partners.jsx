"use client";
import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const PARTNER_LOGOS = [
  { src: "/images/insurance 1.png", alt: "Insurance Partner 1" },
  { src: "/images/insurance 2.png", alt: "Insurance Partner 2" },
  { src: "/images/insurance 3.png", alt: "Insurance Partner 3" },
  { src: "/images/insurance 4.png", alt: "Insurance Partner 4" },
  { src: "/images/insurance 5.png", alt: "Insurance Partner 5" },
  { src: "/images/insurance 6.png", alt: "Insurance Partner 6" },
];

// Render several copies so the track is always wider than the viewport and can
// loop seamlessly by wrapping after exactly one copy's width.
const COPIES = 4;

export default function Partners({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const hoverRef = useRef(false);

  // Continuous marquee driven by requestAnimationFrame so the logos glide
  // smoothly instead of jumping between slides. Pauses while hovered.
  useEffect(() => {
    let raf;
    let last = null;
    const SPEED = 45; // px per second — slow & premium

    const tick = (now) => {
      if (last === null) last = now;
      const dt = (now - last) / 1000;
      last = now;

      const track = trackRef.current;
      if (track && !hoverRef.current) {
        offsetRef.current -= SPEED * dt;
        const oneCopy = track.scrollWidth / COPIES;
        // Wrap by exactly one copy's width for a seamless infinite loop.
        if (oneCopy > 0 && -offsetRef.current >= oneCopy) {
          offsetRef.current += oneCopy;
        }
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const loopLogos = Array.from({ length: COPIES }, () => PARTNER_LOGOS).flat();

  return (
    <section className="py-12 max-[768px]:py-10 bg-[#EFF6F6] overflow-hidden" ref={ref}>
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
          className="text-center text-[clamp(1.4rem,3vw,1.9rem)] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {data.heading}
        </motion.h2>

        {/* Continuous, flat logo marquee */}
        <div
          className="relative"
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
        >
          {/* Soft edge fades so logos ease in/out at the boundaries */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#EFF6F6] to-transparent max-[500px]:w-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#EFF6F6] to-transparent max-[500px]:w-10" />

          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex w-max items-center gap-16 will-change-transform max-[768px]:gap-12 max-[500px]:gap-10"
            >
              {loopLogos.map((p, index) => (
                <img
                  key={index}
                  src={p.src}
                  alt={p.alt}
                  draggable={false}
                  className="h-[46px] w-auto shrink-0 object-contain select-none max-[768px]:h-[38px] max-[500px]:h-[30px]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

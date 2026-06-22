"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

function DollarBadgeIcon({ active }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={active ? "white" : "var(--teal)"} strokeWidth="2" />
      <path
        d="M12 6v12M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5"
        stroke={active ? "white" : "var(--teal)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StudentBadgeIcon({ active }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 18v-7l9-4 9 4-9 4-9-4z"
        stroke={active ? "white" : "var(--teal)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 12.5V17c0 1.1 2.2 3 5 3s5-1.9 5-3v-4.5"
        stroke={active ? "white" : "var(--teal)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarBadgeIcon({ active }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13"
        stroke={active ? "white" : "var(--teal)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2" y="13" width="20" height="6" rx="1.5" stroke={active ? "white" : "var(--teal)"} strokeWidth="2" />
      <circle cx="7" cy="19" r="1.6" fill={active ? "white" : "var(--teal)"} />
      <circle cx="17" cy="19" r="1.6" fill={active ? "white" : "var(--teal)"} />
    </svg>
  );
}

const iconMap = { dollar: DollarBadgeIcon, student: StudentBadgeIcon, car: CarBadgeIcon };

const defaultCards = [
  {
    icon: "dollar",
    badge: "SAVINGS",
    title: "BUNDLE & SAVE",
    desc: "New customers who bundle their home and auto save $1,086 on average.*Read the associated disclosure for this savings claim. Combine coverage for your RV, boat, motorcycle, and more for additional multi-policy savings.",
  },
  {
    icon: "student",
    badge: "SAVINGS",
    title: "STUDENTS DISCOUNT",
    desc: "Students with a B average or better can earn our good student discount for auto insurance,**Read the associated disclosure for this claim. plus teens age 18 or younger get a discount too.†Read the associated disclosure for this auto insurance claim.",
  },
  {
    icon: "car",
    badge: "SAVINGS",
    title: "DRIVE SAFE TO SAVE MORE",
    desc: "Car insurance based on how you drive. On average, customers save up-to $328 in savings per year.",
  },
];

export default function HowItWorks({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const heading = data?.heading || "Discounts that make auto insurance affordable";
  const cards = data?.cards?.length ? data.cards : defaultCards;

  // Auto-rotate the highlighted card border
  useEffect(() => {
    if (!cards.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <section className="pt-20 pb-36 bg-white" id="how-it-works" ref={ref}>
      <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4">
        {/* Heading */}
        <motion.h2
          className="text-center text-[clamp(1.5rem,3.2vw,2rem)] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-12 max-[480px]:mb-9"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:max-w-[420px] max-[900px]:mx-auto">
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon];
            const active = i === activeIndex;
            return (
              <motion.div
                key={i}
                className={`bg-white rounded-[12px] py-7 px-6 transition-all duration-500 ${
                  active
                    ? "border-[1.5px] border-[var(--teal)] shadow-[0_8px_28px_rgba(13,148,136,0.14)]"
                    : "border-[1.5px] border-[var(--gray-200)] shadow-[var(--shadow-sm)]"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
              >
                {/* Badge */}
                <div
                  className={`inline-flex items-center gap-[0.4rem] py-[0.4rem] px-[0.85rem] rounded-full border-[1.5px] text-[0.72rem] font-extrabold tracking-[0.04em] mb-[1.1rem] transition-all duration-500 ${
                    active
                      ? "bg-[var(--teal)] border-[var(--teal)] text-white"
                      : "bg-white border-[var(--teal)] text-[var(--teal)]"
                  }`}
                >
                  {Icon && <Icon active={active} />}
                  {card.badge}
                </div>

                {/* Title */}
                <h3 className="text-[0.98rem] font-extrabold text-[var(--gray-900)] mb-[0.6rem] tracking-[-0.01em]">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-[0.85rem] text-[var(--gray-500)] leading-[1.65]">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
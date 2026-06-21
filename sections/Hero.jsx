


"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

// ── Common email domains used for typo-suggestion (e.g. "gmal.com" -> "gmail.com") ──
const POPULAR_DOMAINS = [
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "hotmail.com",
  "outlook.com", "live.com", "icloud.com", "aol.com", "protonmail.com",
  "rediffmail.com", "msn.com", "ymail.com",
];

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Returns a corrected email string if the domain looks like a close typo of a
// popular provider, otherwise null.
function getEmailSuggestion(email) {
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) return null;
  const domain = email.slice(atIndex + 1).toLowerCase().trim();
  if (!domain) return null;
  if (POPULAR_DOMAINS.includes(domain)) return null;

  let closest = null;
  let minDist = Infinity;
  for (const d of POPULAR_DOMAINS) {
    const dist = levenshtein(domain, d);
    if (dist < minDist) {
      minDist = dist;
      closest = d;
    }
  }

  // Only suggest for genuinely close typos (1-2 character difference), so we
  // don't pester people using legitimate, less common domains.
  if (closest && minDist > 0 && minDist <= 2) {
    return email.slice(0, atIndex + 1) + closest;
  }
  return null;
}

// Colour the "Auto Insurance" phrase teal and break the line before it so the
// first headline reads "Find the Right" / "Auto Insurance &" like the design —
// without hard-coding the surrounding copy (stays data-driven).
function renderHighlightedHeadline(text) {
  const HL = "Auto Insurance";
  const idx = text ? text.indexOf(HL) : -1;
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx).trimEnd()}
      <br />
      <span className="text-[#2DD4BF]">{HL}</span>
      {text.slice(idx + HL.length)}
    </>
  );
}

export default function Hero({ data, site }) {
  const [form, setForm] = useState({ zip: "", name: "", email: "", phone: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── ZIP -> city/state auto-lookup ──
  const [zipInfo, setZipInfo] = useState(null); // { city, state, stateCode }
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState("");

  // ── Email validation ──
  const [emailError, setEmailError] = useState("");
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  useEffect(() => {
    const zip = form.zip;

    if (zip.length !== 5) {
      setZipInfo(null);
      setZipError("");
      setZipLoading(false);
      return;
    }

    let cancelled = false;
    setZipLoading(true);
    setZipError("");

    fetch(`https://api.zippopotam.us/US/${zip}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const place = data.places[0];
        setZipInfo({
          city: place["place name"],
          state: place["state"],
          stateCode: place["state abbreviation"],
        });
      })
      .catch(() => {
        if (cancelled) return;
        setZipInfo(null);
        setZipError("We couldn't find that ZIP code");
      })
      .finally(() => {
        if (!cancelled) setZipLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.zip]);

  const handleZipChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 5);
    setForm({ ...form, zip: digitsOnly });
  };

  const evaluateEmail = (value) => {
    if (!value) {
      setEmailError("");
      setEmailSuggestion(null);
      return;
    }
    if (!isValidEmail(value)) {
      setEmailError("Please enter a valid email address");
      setEmailSuggestion(null);
      return;
    }
    setEmailError("");
    setEmailSuggestion(getEmailSuggestion(value));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, email: value });
    if (emailTouched) evaluateEmail(value);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    evaluateEmail(form.email);
  };

  const applyEmailSuggestion = () => {
    setForm({ ...form, email: emailSuggestion });
    setEmailSuggestion(null);
    setEmailError("");
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, phone: digitsOnly });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setSubmitError("");

    if (!isValidEmail(form.email)) {
      setEmailError("Please enter a valid email address");
      setEmailSuggestion(null);
      return;
    }

    const suggestion = getEmailSuggestion(form.email);
    if (suggestion) {
      // Likely a typo'd domain (e.g. gmal.com) — block submit and surface the fix.
      setEmailError("");
      setEmailSuggestion(suggestion);
      return;
    }

    setEmailError("");
    setEmailSuggestion(null);

    if (!agreed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zipCode: form.zip,
          city: zipInfo?.city || "",
          state: zipInfo?.state || "",
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Trust seals shown in the "Secured By" row (assets in public/images).
  const trustBadges = [
    { src: "/images/Secure%201.png", alt: "Comodo Secure" },
    { src: "/images/Secure%202.png", alt: "DigiCert Secured" },
    { src: "/images/Secure%203.png", alt: "GlobalSign SSL Secured" },
    { src: "/images/Secure%204.png", alt: "BBB Accredited Business" },
  ];

  return (
    <section className="relative min-h-screen bg-[#0B2537] flex items-center pt-[7rem] pb-16 overflow-hidden max-[860px]:pt-24 max-[860px]:pb-12" id="home">
      {/* Background image — vehicles kept visible (balanced like the Contact page) */}
      <img
        src="/images/BG.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-[0.5]"
      />
      {/* Balanced overlay — darker on the left for text legibility, lighter on the right so the vehicles stay visible */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0B2537]/82 via-[#0B2537]/66 to-[#0B2537]/56" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_18%_42%,rgba(13,148,136,0.12)_0%,transparent_55%),radial-gradient(ellipse_at_88%_6%,rgba(249,115,22,0.06)_0%,transparent_45%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-[180px] pointer-events-none bg-[linear-gradient(to_top,rgba(11,37,55,0.7),transparent)]" />

      <div className="w-full max-w-[78rem] mx-auto px-6 max-[768px]:px-4 grid grid-cols-[1.2fr_0.95fr] gap-16 items-start relative z-[1] max-[1060px]:gap-10 max-[860px]:grid-cols-[1fr] max-[860px]:gap-8">

        {/* ── Left ── */}
        <div className="flex flex-col">
          <motion.div className="inline-flex items-center gap-2 bg-[rgba(13,148,136,0.18)] border border-[rgba(13,148,136,0.38)] text-[#5EEAD4] text-[0.78rem] font-semibold py-[0.34rem] px-[0.9rem] rounded-full mb-[1.25rem] w-fit" {...fadeUp(0.1)}>
            <span className="w-[6px] h-[6px] bg-[#5EEAD4] rounded-full animate-[pulse-dot_2s_infinite]" />
            {data.badge}
          </motion.div>

          <motion.h1 className="text-[clamp(2rem,3.5vw,2.9rem)] font-black text-white leading-[1.1] tracking-[-0.03em] mb-[1.05rem] max-[480px]:text-[1.85rem]" {...fadeUp(0.2)}>
            {renderHighlightedHeadline(data.headline1)}
            <br />
            <span className="text-[var(--orange)]">{data.headline2}</span>
          </motion.h1>

          {/* Description — desktop position (hidden on mobile; re-shown after the form below) */}
          <motion.p className="text-white/[0.7] text-[0.95rem] leading-[1.65] mb-[1.5rem] max-w-[430px] max-[860px]:max-w-full max-[860px]:hidden" {...fadeUp(0.3)}>
            {data.description}
          </motion.p>

          <motion.ul className="flex flex-col gap-[0.55rem] mb-[1.75rem] max-[860px]:hidden" {...fadeUp(0.38)}>
            {data.bullets.map((b, i) => (
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

          {/* Stats - Hidden on mobile, will show below form */}
          <motion.div className="flex gap-3 flex-wrap max-[480px]:gap-[0.5rem] max-[860px]:hidden" {...fadeUp(0.46)}>
            {data.stats.map((s, i) => (
              <div key={i} className="bg-white/[0.07] border border-white/[0.1] rounded-[8px] py-[0.5rem] px-[0.95rem] flex flex-col items-center min-w-[82px] max-[480px]:min-w-[74px]">
                <span className="text-[1.15rem] font-black text-white leading-[1.2] max-[480px]:text-[1rem]">{s.value}</span>
                <span className="text-[0.62rem] text-white/[0.45] mt-[0.05rem] text-center">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Secured By — trust badges (desktop) */}
          <motion.div className="mt-[1.4rem] max-[860px]:hidden" {...fadeUp(0.54)}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/40 mb-[0.55rem]">Secured By</p>
            <div className="flex items-center gap-[0.5rem] flex-wrap">
              {trustBadges.map((b, i) => (
                <span key={i} className="bg-white rounded-[7px] h-[36px] px-[0.5rem] flex items-center shadow-[0_3px_12px_rgba(0,0,0,0.18)]">
                  <img src={b.src} alt={b.alt} className="h-[22px] w-auto object-contain" />
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right (Form) ── */}
        <motion.div
          className="bg-white rounded-[20px] p-7 shadow-[var(--shadow-xl)] w-full max-w-[460px] ml-auto max-[860px]:max-w-[520px] max-[860px]:mx-auto max-[860px]:mt-6"
          id="hero-form"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        >
          {/* Card top badge */}
          <div className="inline-flex items-center gap-[0.45rem] text-[var(--teal)] text-[0.7rem] font-bold tracking-[0.08em] uppercase mb-2">
            <span className="w-[22px] h-[22px] bg-[var(--teal)] rounded-[6px] flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            {data.form.badge}
          </div>

          <h2 className="text-[1.45rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-[0.2rem]">{data.form.title}</h2>
          <p className="text-[0.82rem] text-[var(--gray-400)] mb-5">{data.form.subtitle}</p>

          {submitted ? (
            <motion.div
              className="text-center pt-8 px-4 pb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-[58px] h-[58px] bg-[var(--teal)] rounded-full text-white text-[1.7rem] flex items-center justify-center mx-auto mb-4">✓</div>
              <h3 className="text-[1.15rem] font-bold mb-[0.5rem] text-[var(--gray-900)]">Great News!</h3>
              <p className="text-[0.92rem] font-semibold text-[var(--gray-800)] mb-[0.6rem]">
                Your quote request has been submitted successfully.
              </p>
              <p className="text-[0.85rem] text-[var(--gray-500)] leading-[1.6]">
                Our team is now searching for competitive auto insurance options
                that could help you save on coverage. Be ready to review your
                personalized quotes and choose the policy that fits your needs.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[0.7rem]">
              {/* ZIP */}
              <div>
                <div className="relative flex items-center">
                  <span className="absolute left-[0.85rem] flex items-center pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                        stroke="#9CA3AF" strokeWidth="2" />
                      <circle cx="12" cy="10" r="3" stroke="#9CA3AF" strokeWidth="2" />
                    </svg>
                  </span>
                  <input
                    type="text" inputMode="numeric" placeholder="ZIP Code" maxLength={5} required
                    className="w-full py-[0.78rem] pr-[0.85rem] pl-[2.45rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.88rem] text-[var(--gray-800)] bg-[#FAFAFA] outline-none [transition:border-color_0.2s,box-shadow_0.2s,background_0.2s] focus:border-[var(--teal)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)] placeholder:text-[var(--gray-400)]"
                    value={form.zip}
                    onChange={handleZipChange}
                  />
                </div>

                {/* Detected city / state, or error, shown right under the ZIP field */}
                {zipLoading && (
                  <p className="text-[0.7rem] text-[var(--gray-400)] mt-[0.3rem] ml-[0.2rem]">Looking up your area...</p>
                )}
                {!zipLoading && zipInfo && (
                  <p className="text-[0.7rem] text-[var(--teal)] font-medium mt-[0.3rem] ml-[0.2rem] flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {zipInfo.city}, {zipInfo.stateCode}
                  </p>
                )}
                {!zipLoading && zipError && (
                  <p className="text-[0.7rem] text-red-500 mt-[0.3rem] ml-[0.2rem]">{zipError}</p>
                )}
              </div>

              {/* Hidden fields so state/city travel with the form submission */}
              <input type="hidden" name="state" value={zipInfo?.state || ""} />
              <input type="hidden" name="city" value={zipInfo?.city || ""} />

              {/* Name */}
              <div className="relative flex items-center">
                <span className="absolute left-[0.85rem] flex items-center pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                      stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="7" r="4" stroke="#9CA3AF" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  type="text" placeholder="Full Name" required
                  className="w-full py-[0.78rem] pr-[0.85rem] pl-[2.45rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.88rem] text-[var(--gray-800)] bg-[#FAFAFA] outline-none [transition:border-color_0.2s,box-shadow_0.2s,background_0.2s] focus:border-[var(--teal)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)] placeholder:text-[var(--gray-400)]"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {/* Email */}
              <div>
                <div className="relative flex items-center">
                  <span className="absolute left-[0.85rem] flex items-center pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        stroke="#9CA3AF" strokeWidth="2" />
                      <polyline points="22,6 12,13 2,6" stroke="#9CA3AF" strokeWidth="2" />
                    </svg>
                  </span>
                  <input
                    type="email" placeholder="Email Address" required
                    className={`w-full py-[0.78rem] pr-[0.85rem] pl-[2.45rem] border-[1.5px] rounded-[8px] text-[0.88rem] text-[var(--gray-800)] bg-[#FAFAFA] outline-none [transition:border-color_0.2s,box-shadow_0.2s,background_0.2s] placeholder:text-[var(--gray-400)] ${
                      emailError || emailSuggestion
                        ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                        : "border-[var(--gray-200)] focus:border-[var(--teal)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)]"
                    }`}
                    value={form.email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                </div>
                {emailError && (
                  <p className="text-[0.7rem] text-red-500 mt-[0.3rem] ml-[0.2rem]">{emailError}</p>
                )}
                {!emailError && emailSuggestion && (
                  <p className="text-[0.7rem] text-red-500 mt-[0.3rem] ml-[0.2rem]">
                    Did you mean{" "}
                    <button
                      type="button"
                      onClick={applyEmailSuggestion}
                      className="underline font-semibold text-[var(--teal)] cursor-pointer"
                    >
                      {emailSuggestion}
                    </button>
                    ?
                  </p>
                )}
              </div>
              {/* Phone */}
              <div className="relative flex items-center">
                <span className="absolute left-[0.85rem] flex items-center pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                      stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="tel" inputMode="numeric" placeholder="Phone Number" required
                  className="w-full py-[0.78rem] pr-[0.85rem] pl-[2.45rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.88rem] text-[var(--gray-800)] bg-[#FAFAFA] outline-none [transition:border-color_0.2s,box-shadow_0.2s,background_0.2s] focus:border-[var(--teal)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)] placeholder:text-[var(--gray-400)]"
                  value={form.phone}
                  onChange={handlePhoneChange}
                />
              </div>

              {/* Consent */}
              <label className="flex gap-[0.55rem] items-start cursor-pointer mt-[0.15rem]">
                <input
                  type="checkbox" className="w-[15px] h-[15px] mt-[2px] shrink-0 accent-[var(--teal)] cursor-pointer"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-[0.72rem] text-[var(--gray-500)] leading-[1.55]">
                  By clicking submit, I agree to the{" "}
                  <a href="#" className="text-[var(--teal)] underline">Terms of Service</a> and <a href="#" className="text-[var(--teal)] underline">Privacy Policy</a>.
                  I grant express written consent for SaveDriveQuotes and its{" "}
                  <a href="#" className="text-[var(--teal)] underline">trusted third-party insurance partners</a> to contact me
                  regarding my insurance request via automated or prerecorded calls,
                  SMS/text messages, and email, even if my number is on a Do Not Call
                  list. Consent is not a condition of purchase.
                </span>
              </label>

              <button
                type="submit"
                className={`w-full py-[0.95rem] px-4 rounded-full text-white text-[0.98rem] font-bold flex items-center justify-center gap-2 [transition:background_0.2s,transform_0.15s,box-shadow_0.2s] mt-[0.15rem] ${
                  agreed
                    ? "bg-[var(--orange)] cursor-pointer shadow-[0_4px_18px_rgba(249,115,22,0.4)] hover:bg-[var(--orange-dark)] hover:-translate-y-px"
                    : "bg-[var(--gray-300)] cursor-not-allowed"
                }`}
                disabled={!agreed || loading}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-[rgba(255,255,255,0.35)] border-t-white rounded-full animate-[spin_0.7s_linear_infinite] inline-block" />
                ) : (
                  <>
                    {data.form.cta}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>

              {submitError && (
                <p className="text-[0.72rem] text-red-500 text-center mt-[0.1rem]">{submitError}</p>
              )}

              <p className="flex items-center justify-center gap-[0.3rem] text-[0.72rem] text-[var(--gray-400)] text-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke="#9CA3AF" strokeWidth="2" />
                </svg>
                {data.form.trust}
              </p>

              <div className="border-t border-t-[var(--gray-200)] pt-[0.7rem] mt-[0.2rem] text-center">
                <p className="text-[0.62rem] font-bold tracking-[0.08em] text-[var(--gray-400)] mb-[0.4rem] uppercase">{data.form.partnersLabel}</p>
                <div className="flex flex-wrap justify-center gap-x-[0.75rem] gap-y-[0.4rem]">
                  {data.form.partners.map((p, i) => (
                    <span key={i} className="text-[0.75rem] text-[var(--gray-500)] font-medium">{p}</span>
                  ))}
                </div>
              </div>
            </form>
          )}
        </motion.div>

        {/* Description — mobile position (shown after the form so order is Heading → Form → Paragraph) */}
        <motion.p
          className="hidden max-[860px]:block text-white/[0.7] text-[0.95rem] leading-[1.65] mt-7 w-full max-w-[520px] mx-auto"
          {...fadeUp(0.4)}
        >
          {data.description}
        </motion.p>

        {/* ── Mobile Stats (appears below form on mobile) ── */}
        <motion.div
          className="hidden max-[860px]:flex gap-3 flex-wrap justify-center max-[480px]:gap-[0.5rem] max-[860px]:mt-8"
          {...fadeUp(0.46)}
        >
          {data.stats.map((s, i) => (
            <div key={i} className="bg-white/[0.07] border border-white/[0.1] rounded-[8px] py-[0.5rem] px-[0.95rem] flex flex-col items-center min-w-[82px] max-[480px]:min-w-[74px]">
              <span className="text-[1.15rem] font-black text-white leading-[1.2] max-[480px]:text-[1rem]">{s.value}</span>
              <span className="text-[0.62rem] text-white/[0.45] mt-[0.05rem] text-center">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Secured By — trust badges (mobile) */}
        <div className="hidden max-[860px]:flex flex-col items-center mt-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/40 mb-[0.55rem]">Secured By</p>
          <div className="flex items-center justify-center gap-[0.5rem] flex-wrap">
            {trustBadges.map((b, i) => (
              <span key={i} className="bg-white rounded-[7px] h-[36px] px-[0.5rem] flex items-center shadow-[0_3px_12px_rgba(0,0,0,0.18)]">
                <img src={b.src} alt={b.alt} className="h-[22px] w-auto object-contain" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
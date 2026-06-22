"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ site }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[1000] [transition:background_0.35s_ease,box-shadow_0.35s_ease,padding_0.3s_ease] ${
        scrolled
          ? "py-[0.7rem] bg-[rgba(11,37,55,0.96)] backdrop-blur-[14px] shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
          : "py-4"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full max-w-[80rem] mx-auto px-6 max-[768px]:px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="w-[34px] h-[34px] bg-[var(--teal)] rounded-[8px] flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[1.15rem] font-extrabold tracking-[-0.02em]">
            <span className="text-white">Smart </span>
            <span className="text-[var(--teal)]">Cover </span>
            <span className="text-white">Auto</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-[0.35rem] text-white/70 text-[0.8rem] font-medium max-[768px]:hidden">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
            </svg>
            SSL Secured
          </span>

          <Link href="/contact" aria-label="Call Now" className="inline-flex items-center justify-center border-[1.5px] border-[var(--teal)] text-[var(--teal)] p-[0.55rem] rounded-full no-underline [transition:background_0.2s_ease,color_0.2s_ease,transform_0.15s_ease] hover:bg-[var(--teal)] hover:text-white hover:-translate-y-0.5 active:translate-y-0 max-[768px]:hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>

          <Link href="/#hero-form" className="inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-bold text-[0.88rem] py-[0.6rem] px-[1.4rem] rounded-full tracking-[0.01em] shadow-[0_4px_18px_rgba(249,115,22,0.38)] no-underline [transition:background_0.2s_ease,transform_0.15s_ease,box-shadow_0.2s_ease] hover:bg-[var(--orange-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.45)] active:translate-y-0 max-[768px]:hidden">
            Get Free Quote
          </Link>
        </div>

        {/* Hamburger */}
        <button className="hidden flex-col gap-[5px] p-[6px] cursor-pointer max-[768px]:flex" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`block w-[22px] h-[2px] bg-white rounded-[2px] [transition:transform_0.28s_ease,opacity_0.28s_ease] ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-white rounded-[2px] [transition:transform_0.28s_ease,opacity_0.28s_ease] ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-white rounded-[2px] [transition:transform_0.28s_ease,opacity_0.28s_ease] ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="bg-[var(--navy-mid)] border-t border-t-white/[0.07] overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            
            <div className="pt-3 px-5 pb-5 flex flex-col gap-3">
              <Link href="/contact" aria-label="Call Now" className="inline-flex items-center justify-center border-[1.5px] border-[var(--teal)] text-[var(--teal)] py-[0.85rem] px-8 rounded-full no-underline [transition:background_0.2s_ease,color_0.2s_ease] hover:bg-[var(--teal)] hover:text-white w-full" onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
              <Link href="/#hero-form" className="inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-bold text-[1rem] py-[0.9rem] px-8 rounded-full tracking-[0.01em] shadow-[0_4px_18px_rgba(249,115,22,0.38)] no-underline [transition:background_0.2s_ease,transform_0.15s_ease,box-shadow_0.2s_ease] hover:bg-[var(--orange-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.45)] active:translate-y-0 w-full" onClick={() => setMenuOpen(false)}>
                Get Free Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}



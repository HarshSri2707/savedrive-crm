"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <path
        d="M3 12l9-9 9 9M5 10v10h14V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: (
      <>
        <path
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    href: "/admin/contacts",
    label: "Contacts",
    icon: (
      <>
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the request fails, send the user to login.
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-[230px] shrink-0 bg-[#0B2537] min-h-screen flex flex-col px-4 py-6 max-[768px]:w-[64px]">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="w-[28px] h-[28px] bg-[var(--teal)] rounded-[8px] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-white font-extrabold text-[1rem] tracking-[-0.02em] max-[768px]:hidden">
          SaveDrive
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-medium [transition:background_0.15s,color_0.15s] ${
                active
                  ? "bg-[var(--teal)] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                {item.icon}
              </svg>
              <span className="max-[768px]:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-auto flex items-center gap-3 px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-medium text-white/70 hover:bg-white/10 hover:text-white [transition:background_0.15s,color_0.15s] disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="max-[768px]:hidden">
          {loggingOut ? "Logging out..." : "Logout"}
        </span>
      </button>
    </aside>
  );
}

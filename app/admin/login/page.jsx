"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Cookie is set by the server; go to the protected dashboard.
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B2537] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h1 className="text-[1.45rem] font-extrabold text-[var(--gray-900)] tracking-[-0.02em] mb-1">
          Admin Login
        </h1>
        <p className="text-[0.82rem] text-[var(--gray-400)] mb-6">
          Sign in to manage your leads.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[0.78rem] font-semibold text-[var(--gray-500)]">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              className="w-full py-[0.78rem] px-[0.85rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.88rem] text-[var(--gray-800)] bg-[#FAFAFA] outline-none focus:border-[var(--teal)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[0.78rem] font-semibold text-[var(--gray-500)]">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full py-[0.78rem] px-[0.85rem] border-[1.5px] border-[var(--gray-200)] rounded-[8px] text-[0.88rem] text-[var(--gray-800)] bg-[#FAFAFA] outline-none focus:border-[var(--teal)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)]"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-[0.78rem] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-[0.9rem] px-4 rounded-full text-white text-[0.95rem] font-bold mt-1 [transition:background_0.2s] ${
              loading
                ? "bg-[var(--gray-300)] cursor-not-allowed"
                : "bg-[var(--teal)] cursor-pointer hover:opacity-90"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

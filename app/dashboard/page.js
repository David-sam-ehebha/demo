"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/authStore";

export default function Dashboard() {
  const { user, isAuthenticated, hasHydrated, hydrate, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) router.push("/login");
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-sky-50 to-white text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "No email available";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-sky-50 to-indigo-50 px-4 py-6 font-sans sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="mb-8 rounded-3xl border border-white/70 bg-white/65 px-5 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Dashboard</p>
              <h1 className="mt-1 text-xl font-semibold text-slate-800 sm:text-2xl">Account Overview</h1>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-[0_8px_20px_rgba(148,163,184,0.18)]">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-linear-to-br from-sky-200 to-indigo-200 text-sm font-bold text-slate-700 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">Hi {displayName}!</p>
                <p className="truncate text-xs text-slate-500">{displayEmail}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-20 -bottom-28 h-64 w-64 rounded-full bg-indigo-200/35 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">
                Daily Summary
              </p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Welcome back, {displayName}! 👋
              </h2>
              <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
                Here&apos;s what&apos;s happening with your account today.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_35px_rgba(148,163,184,0.2)] sm:p-5">
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">Users</p>
                  <p className="mt-2 text-lg font-semibold text-slate-800">4.2k</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">Revenue</p>
                  <p className="mt-2 text-lg font-semibold text-slate-800">$18k</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">Growth</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-600">+12%</p>
                </div>
              </div>

              <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
                <svg viewBox="0 0 360 170" className="h-40 w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M20 130 C 75 85, 120 110, 170 78 C 220 46, 272 64, 335 24" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                  <path d="M20 130 C 75 85, 120 110, 170 78 C 220 46, 272 64, 335 24 L335 150 L20 150 Z" fill="url(#chartArea)" />
                  <circle cx="170" cy="78" r="6" fill="#0ea5e9" />
                  <circle cx="272" cy="64" r="6" fill="#38bdf8" />
                </svg>

                <div className="pointer-events-none absolute top-3 right-4 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-md">
                  <p className="text-xs font-medium text-slate-500">Conversion</p>
                  <p className="text-sm font-semibold text-slate-800">32.8%</p>
                </div>

                <div className="pointer-events-none absolute bottom-3 left-4 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-md">
                  <p className="text-xs font-medium text-slate-500">Active Sessions</p>
                  <p className="text-sm font-semibold text-slate-800">1,284</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
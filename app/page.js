"use client";

import { useEffect } from "react";
import Link from "next/link";
import useAuthStore from "../store/authStore";

export default function Home() {
  const { isAuthenticated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const statusText = isAuthenticated ? "Logged In" : "Not Logged In";

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-sky-50 to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-[0_20px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Welcome 👋</h1>

        <p
          className={`mt-4 text-sm font-medium ${
            isAuthenticated ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          Status: {statusText}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(236,72,153,0.28)] transition hover:bg-pink-600"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_8px_18px_rgba(148,163,184,0.18)] transition hover:border-slate-400 hover:bg-slate-50"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
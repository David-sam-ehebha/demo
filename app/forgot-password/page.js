"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1: send code, 2: verify code
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setStep(2);
      setMessage("Code sent. Check your email.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-reset-code", { email, code });
      const resetToken = res?.data?.resetToken;
      if (!resetToken) {
        setMessage("Invalid response from server.");
        return;
      }
      router.push(`/reset-password/${resetToken}`);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl items-start justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-orange-100 text-orange-600">S</span>
          <span>Home</span>
        </Link>
      </div>

      <div className="mx-auto mt-10 flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center">
        <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_20px_40px_rgba(15,23,42,0.08)] sm:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-500 shadow-inner">
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path
                  d="M12 3.5 3.5 8v8L12 20.5 20.5 16V8L12 3.5Zm0 2.1 6.5 3.4-6.5 3.4-6.5-3.4L12 5.6Zm-6.9 4.7L11 13.4v5.1l-5.9-3.1v-5.1Zm7.9 8.2v-5.1l5.9-3.1v5.1L13 18.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Forgot your password?</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email address and we&apos;ll send you instructions to continue.
            </p>
          </div>

          {message && (
            <p className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">{message}</p>
          )}

          {step === 1 ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="username@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(249,115,22,0.28)] transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Email"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <div>
                <label htmlFor="code" className="mb-2 block text-sm font-medium text-slate-700">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(249,115,22,0.28)] transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/login" className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-800">
              <span aria-hidden="true">←</span>
              <span>Back to Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { z } from "zod";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = registerSchema.safeParse({ email, password });

    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }

    try {
      const username = email.split("@")[0] || "user";
      const response = await api.post("/auth/register", { username, email, password });
      console.log("Registration successful:", response.data);
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const socialButtons = [
    {
      label: "Google",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12 10.2v4.14h5.9c-.26 1.34-1.02 2.48-2.18 3.25l3.52 2.73c2.05-1.9 3.23-4.69 3.23-8 0-.78-.07-1.53-.2-2.25H12Z"
          />
          <path
            fill="#34A853"
            d="M12 22c2.92 0 5.37-.96 7.16-2.61l-3.52-2.73c-.98.67-2.23 1.08-3.64 1.08-2.79 0-5.15-1.88-5.99-4.4H2.37v2.77A10 10 0 0 0 12 22Z"
          />
          <path
            fill="#FBBC05"
            d="M6.01 13.34A6.03 6.03 0 0 1 5.67 12c0-.46.08-.9.22-1.34V7.89H2.37A10 10 0 0 0 2 12c0 1.62.39 3.15 1.08 4.51l2.93-3.17Z"
          />
          <path
            fill="#4285F4"
            d="M12 6.26c1.59 0 3.02.55 4.14 1.63l3.1-3.11C17.36 3.04 14.92 2 12 2A10 10 0 0 0 2.37 7.89l3.52 2.77c.84-2.52 3.2-4.4 6.11-4.4Z"
          />
        </svg>
      ),
    },
    {
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#1877F2"
            d="M24 12a12 12 0 1 0-13.88 11.85v-8.39H7.08V12h3.04V9.41c0-3 1.8-4.66 4.55-4.66 1.32 0 2.7.24 2.7.24v2.95h-1.52c-1.5 0-1.97.93-1.97 1.88V12h3.35l-.54 3.46h-2.81v8.39A12 12 0 0 0 24 12Z"
          />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#0A66C2"
            d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.68H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.31 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.09 20.45H3.52V9h3.57v11.45Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <div className="w-full rounded-3xl border border-white/70 bg-white/90 p-7 shadow-[0_18px_45px_rgba(50,90,150,0.15)] backdrop-blur-sm sm:p-9">
          <div className="mb-8 text-center">
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-slate-900">Sign Up</h1>
            <p className="mt-2 text-sm text-slate-500">Create your account in a few seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(236,72,153,0.28)] transition hover:bg-pink-600"
            >
              Sign Up
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">OR</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex items-center justify-center gap-4">
            {socialButtons.map((social) => (
              <button
                key={social.label}
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:shadow-sm"
                aria-label={`Continue with ${social.label}`}
                title={social.label}
              >
                {social.icon}
              </button>
            ))}
          </div>

          <p className="mt-7 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
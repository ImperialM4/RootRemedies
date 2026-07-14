"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [secret,  setSecret]  = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/analytics?period=7d", {
      headers: { "x-admin-secret": secret },
    });

    if (res.ok) {
      sessionStorage.setItem("adminSecret", secret);
      router.push("/admin");
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-semibold text-lg text-bark-100">RootRemedies</span>
        </div>

        <div className="bg-bark-900 border border-bark-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-bark-400" />
            <h1 className="text-sm font-semibold text-bark-300 uppercase tracking-widest">Admin Access</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="secret" className="block text-xs text-bark-400 mb-1.5">Password</label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full bg-bark-800 border border-bark-700 rounded-lg px-3 py-2.5 text-sm text-bark-100 placeholder:text-bark-500 focus:outline-none focus:border-sage-500 transition-colors"
                placeholder="Enter admin password"
                autoFocus
                required
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage-600 hover:bg-sage-500 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              {loading ? "Checking…" : "Access Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-bark-600 mt-4">
          Set <code className="text-bark-500">ADMIN_SECRET</code> in your Vercel environment variables.
        </p>
      </div>
    </div>
  );
}

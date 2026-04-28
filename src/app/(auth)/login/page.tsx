"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mic } from "lucide-react"

import { createClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Mic size={16} className="text-white" />
        </div>
        <span className="font-semibold text-zinc-900">FieldCRM</span>
      </div>

      <h2 className="text-xl font-semibold text-zinc-900 mb-1">Sign in</h2>
      <p className="text-sm text-zinc-500 mb-6">Manager dashboard access</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-zinc-600 block mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-600 block mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-xs text-center text-zinc-400">
          New here?{" "}
          <Link href="/signup" className="text-emerald-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}

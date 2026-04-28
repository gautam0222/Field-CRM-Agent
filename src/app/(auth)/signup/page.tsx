"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mic } from "lucide-react"

import { createClient } from "@/lib/supabase"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/dashboard` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push("/dashboard")
      router.refresh()
      return
    }

    setDone(true)
    setLoading(false)
  }

  const inputClass =
    "w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
  const labelClass = "text-xs font-medium text-zinc-600 block mb-1.5"

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <Mic size={18} className="text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Check your email
        </h2>
        <p className="text-sm text-zinc-500">
          We sent a confirmation link to <strong>{email}</strong>
        </p>
        <Link
          href="/login"
          className="inline-flex mt-5 text-sm font-medium text-emerald-600 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Mic size={16} className="text-white" />
        </div>
        <span className="font-semibold text-zinc-900">FieldCRM</span>
      </div>

      <h2 className="text-xl font-semibold text-zinc-900 mb-1">
        Create account
      </h2>
      <p className="text-sm text-zinc-500 mb-6">Manager access</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Min 6 characters"
            className={inputClass}
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
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-xs text-center text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}

"use client"

import { useState }  from "react"
import { useRouter } from "next/navigation"
import Link          from "next/link"
import { ZONES }     from "@/config/constants"
import { ArrowLeft } from "lucide-react"

export default function NewRepPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name:  "",
    phone: "",
    email: "",
    zone:  ZONES[0],
  })
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    const res = await fetch("/api/reps", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name:  form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        zone:  form.zone,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/reps")
  }

  const inputClass = "w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
  const labelClass = "text-xs font-medium text-zinc-600 block mb-1.5"

  return (
    <div className="max-w-md space-y-5">

      <Link
        href="/reps"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Reps
      </Link>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Add Field Rep</h2>
        <p className="text-sm text-zinc-500">
          Register a new rep so their Bolna calls get logged correctly
        </p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">

        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Raj Sharma"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+919876543210"
            className={inputClass}
          />
          <p className="text-xs text-zinc-400 mt-1">
            Must match the number the rep calls from
          </p>
        </div>

        <div>
          <label className={labelClass}>Email (optional)</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="raj@company.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Zone / Territory *</label>
          <select
            value={form.zone}
            onChange={(e) => update("zone", e.target.value)}
            className={inputClass}
          >
            {ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.name || !form.phone}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? "Adding rep…" : "Add Rep"}
        </button>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Phone, Loader2, CheckCircle } from "lucide-react"

interface Props {
  repId:   string
  repName: string
}

export function TriggerCallButton({ repId, repName }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleTrigger() {
    setStatus("loading")

    const res = await fetch("/api/agent/trigger", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ repId }),
    })

    if (res.ok) {
      setStatus("success")
      setTimeout(() => setStatus("idle"), 3000)
    } else {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <button
      onClick={handleTrigger}
      disabled={status === "loading"}
      className={`
        inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
        transition-all shrink-0
        ${status === "success"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : status === "error"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }
        disabled:opacity-60
      `}
    >
      {status === "loading" && <Loader2 size={15} className="animate-spin" />}
      {status === "success" && <CheckCircle size={15} />}
      {status === "idle"    && <Phone size={15} />}
      {status === "error"   && <Phone size={15} />}

      {status === "loading" ? "Calling…"
        : status === "success" ? "Call triggered!"
        : status === "error"   ? "Failed — retry"
        : `Call ${repName}`}
    </button>
  )
}
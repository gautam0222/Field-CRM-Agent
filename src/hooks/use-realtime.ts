"use client"

import { useEffect } from "react"

import { createClient } from "@/lib/supabase"

interface UseRealtimeOptions {
  table: string
  event?: "*" | "INSERT" | "UPDATE" | "DELETE"
  onChange: () => void
}

export function useRealtime({
  table,
  event = "*",
  onChange,
}: UseRealtimeOptions) {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        "postgres_changes",
        { event, schema: "public", table },
        () => onChange()
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [event, onChange, table])
}

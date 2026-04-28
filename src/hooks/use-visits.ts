"use client"

import { useEffect, useMemo, useState } from "react"

import type { Visit } from "@/types/visit"

interface VisitsResponse {
  visits: Visit[]
}

interface UseVisitsOptions {
  repId?: string
  limit?: number
}

export function useVisits(options: UseVisitsOptions = {}) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (options.repId) params.set("repId", options.repId)
    if (options.limit) params.set("limit", String(options.limit))
    return params.toString()
  }, [options.limit, options.repId])

  useEffect(() => {
    let active = true

    async function loadVisits() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/visits${query ? `?${query}` : ""}`)
        if (!response.ok) {
          throw new Error("Failed to load visits")
        }

        const data = (await response.json()) as VisitsResponse
        if (active) {
          setVisits(data.visits)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load visits")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadVisits()

    return () => {
      active = false
    }
  }, [query])

  return { visits, loading, error }
}

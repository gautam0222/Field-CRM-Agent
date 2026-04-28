"use client"

import { useEffect, useState } from "react"

import type { Rep } from "@/types/rep"

interface RepsResponse {
  reps: Rep[]
}

export function useReps() {
  const [reps, setReps] = useState<Rep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadReps() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/reps")
        if (!response.ok) {
          throw new Error("Failed to load reps")
        }

        const data = (await response.json()) as RepsResponse
        if (active) {
          setReps(data.reps)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load reps")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadReps()

    return () => {
      active = false
    }
  }, [])

  return { reps, loading, error }
}

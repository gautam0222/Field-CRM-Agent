import Link from "next/link"

import { cn } from "@/lib/utils"

interface LeaderboardRep {
  id: string
  name: string
  zone: string
  visits: number
  positiveRate?: number
}

interface RepLeaderboardProps {
  reps: LeaderboardRep[]
  className?: string
}

export function RepLeaderboard({ reps, className }: RepLeaderboardProps) {
  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white", className)}>
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-zinc-800">Top Reps</h3>
        <p className="mt-0.5 text-xs text-zinc-400">Ranked by visit volume</p>
      </div>

      <div className="divide-y divide-zinc-50">
        {reps.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-400">
            No rep activity yet.
          </div>
        ) : (
          reps.map((rep, index) => (
            <Link
              key={rep.id}
              href={`/reps/${rep.id}`}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-zinc-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-800">
                    {rep.name}
                  </p>
                  <p className="text-xs text-zinc-400">{rep.zone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900">
                  {rep.visits}
                </p>
                <p className="text-xs text-zinc-400">
                  {rep.positiveRate ?? 0}% positive
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

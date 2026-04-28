import Link from "next/link"
import { MapPin } from "lucide-react"

import { cn, sentimentColor, sentimentLabel, timeAgo, truncate } from "@/lib/utils"
import type { Visit } from "@/types/visit"

export function VisitFeed({ visits }: { visits: Visit[] }) {
  if (!visits.length) {
    return (
      <div className="py-10 text-center text-sm text-zinc-400">
        No visits yet today
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => (
        <Link
          key={visit.id}
          href={`/visits/${visit.id}`}
          className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-zinc-50"
        >
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <MapPin size={14} className="text-emerald-600" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-zinc-800">
                {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
              </p>
              <span className="shrink-0 text-xs text-zinc-400">
                {timeAgo(visit.createdAt)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              {visit.rep?.name ?? "Unknown rep"} - {visit.rep?.zone ?? "No zone"}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-400">
              {truncate(visit.notes)}
            </p>
          </div>

          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
              sentimentColor(visit.sentiment)
            )}
          >
            {sentimentLabel(visit.sentiment)}
          </span>
        </Link>
      ))}
    </div>
  )
}

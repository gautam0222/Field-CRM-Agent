import Link from "next/link"
import { Calendar, UserRound } from "lucide-react"

import { cn, formatDateTime, sentimentColor, sentimentLabel, truncate } from "@/lib/utils"
import type { Visit } from "@/types/visit"

interface VisitCardProps {
  visit: Visit
}

export function VisitCard({ visit }: VisitCardProps) {
  return (
    <Link
      href={`/visits/${visit.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
          </p>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <UserRound size={12} />
              {visit.rep?.name ?? "Unassigned rep"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDateTime(visit.createdAt)}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
            sentimentColor(visit.sentiment)
          )}
        >
          {sentimentLabel(visit.sentiment)}
        </span>
      </div>

      <p className="mt-3 text-sm text-zinc-500">{truncate(visit.notes, 120)}</p>

      {visit.productsDiscussed.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visit.productsDiscussed.slice(0, 3).map((product) => (
            <span
              key={product}
              className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600"
            >
              {product}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

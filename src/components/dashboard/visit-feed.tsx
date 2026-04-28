import Link               from "next/link"
import { Visit }          from "@/types/visit"
import { timeAgo, sentimentColor, sentimentLabel, truncate } from "@/lib/utils"
import { cn }             from "@/lib/utils"
import { MapPin }         from "lucide-react"

export function VisitFeed({ visits }: { visits: Visit[] }) {
  if (!visits.length) {
    return (
      <div className="text-center py-10 text-zinc-400 text-sm">
        No visits yet today
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {visits.map((v) => (
        <Link
          key={v.id}
          href={`/visits/${v.id}`}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin size={14} className="text-emerald-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-800 truncate">
                {v.doctorName ? `Dr. ${v.doctorName}` : "Unknown Doctor"}
              </p>
              <span className="text-xs text-zinc-400 shrink-0">
                {timeAgo(v.createdAt)}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {v.rep?.name} · {v.rep?.zone}
            </p>
            <p className="text-xs text-zinc-400 mt-1 truncate">
              {truncate(v.notes)}
            </p>
          </div>

          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0",
            sentimentColor(v.sentiment)
          )}>
            {sentimentLabel(v.sentiment)}
          </span>
        </Link>
      ))}
    </div>
  )
}
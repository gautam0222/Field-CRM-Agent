import { Calendar, CheckCircle, MessageSquare, Mic, Package } from "lucide-react"

import { cn, formatDate, formatDateTime, sentimentColor, sentimentLabel } from "@/lib/utils"
import type { Visit } from "@/types/visit"

interface VisitDetailProps {
  visit: Visit
}

export function VisitDetail({ visit }: VisitDetailProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {visit.rep?.name ?? "Unknown rep"} · {visit.rep?.zone ?? "No zone"}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {formatDateTime(visit.createdAt)}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
              sentimentColor(visit.sentiment)
            )}
          >
            {sentimentLabel(visit.sentiment)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <VisitListPanel
          icon={Package}
          title="Products Discussed"
          items={visit.productsDiscussed}
          empty="None recorded"
        />
        <VisitListPanel
          icon={CheckCircle}
          title="Samples Given"
          items={visit.samplesGiven}
          empty="None recorded"
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="space-y-4">
          {visit.followUpDate && (
            <div>
              <PanelTitle icon={Calendar} title="Follow-up Date" />
              <p className="mt-1.5 text-sm text-zinc-700">
                {formatDate(visit.followUpDate)}
              </p>
            </div>
          )}

          {visit.notes && (
            <div>
              <PanelTitle icon={MessageSquare} title="Visit Notes" />
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                {visit.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {visit.transcript && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <PanelTitle icon={Mic} title="Voice Transcript" />
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-500">
            {visit.transcript}
          </p>
        </div>
      )}
    </div>
  )
}

function VisitListPanel({
  icon,
  title,
  items,
  empty,
}: {
  icon: typeof Package
  title: string
  items: string[]
  empty: string
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <PanelTitle icon={icon} title={title} />
      {items.length > 0 ? (
        <div className="mt-3 space-y-1.5">
          {items.map((item) => (
            <div key={item} className="rounded-lg bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-zinc-400">{empty}</p>
      )}
    </div>
  )
}

function PanelTitle({
  icon: Icon,
  title,
}: {
  icon: typeof Package
  title: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-emerald-600" />
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
        {title}
      </p>
    </div>
  )
}

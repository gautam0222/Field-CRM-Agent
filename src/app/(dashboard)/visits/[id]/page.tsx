import { prisma }     from "@/lib/prisma"
import { notFound }   from "next/navigation"
import Link           from "next/link"
import { formatDate, formatDateTime, sentimentColor, sentimentLabel, cn } from "@/lib/utils"
import { ArrowLeft, Mic, Package, Calendar, MessageSquare, CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const visit = await prisma.visit.findUnique({
    where:   { id },
    include: { rep: true },
  })

  if (!visit) notFound()

  return (
    <div className="max-w-2xl space-y-5">

      {/* Back */}
      <Link
        href="/visits"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Visits
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {visit.rep.name} · {visit.rep.zone}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {formatDateTime(visit.createdAt)}
            </p>
          </div>

          <span className={cn(
            "text-xs px-3 py-1 rounded-full border font-medium shrink-0",
            sentimentColor(visit.sentiment)
          )}>
            {sentimentLabel(visit.sentiment)}
          </span>
        </div>
      </div>

      {/* Products & Samples */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Package size={15} className="text-emerald-600" />
            <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Products Discussed
            </p>
          </div>
          {visit.productsDiscussed.length > 0 ? (
            <div className="space-y-1.5">
              {visit.productsDiscussed.map((p) => (
                <div key={p} className="text-sm text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-lg">
                  {p}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">None recorded</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={15} className="text-emerald-600" />
            <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Samples Given
            </p>
          </div>
          {visit.samplesGiven.length > 0 ? (
            <div className="space-y-1.5">
              {visit.samplesGiven.map((s) => (
                <div key={s} className="text-sm text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-lg">
                  {s}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">None given</p>
          )}
        </div>
      </div>

      {/* Follow-up + Notes */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        {visit.followUpDate && (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar size={15} className="text-emerald-600" />
              <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                Follow-up Date
              </p>
            </div>
            <p className="text-sm text-zinc-700">{formatDate(visit.followUpDate)}</p>
          </div>
        )}

        {visit.notes && (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare size={15} className="text-emerald-600" />
              <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                Visit Notes
              </p>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">{visit.notes}</p>
          </div>
        )}
      </div>

      {/* Transcript */}
      {visit.transcript && (
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mic size={15} className="text-emerald-600" />
            <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Voice Transcript
            </p>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-wrap">
            {visit.transcript}
          </p>
        </div>
      )}

      {/* SMS status */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          visit.smsSent ? "bg-emerald-500" : "bg-zinc-300"
        )} />
        {visit.smsSent ? "SMS confirmation sent to rep" : "SMS not sent"}
      </div>
    </div>
  )
}   
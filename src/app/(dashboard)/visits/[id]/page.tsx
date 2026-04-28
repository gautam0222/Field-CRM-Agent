import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, CheckCircle, MessageSquare, Mic, Package } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { cn, formatDate, formatDateTime, sentimentColor, sentimentLabel } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const visit = await prisma.visit.findUnique({
    where: { id },
    include: { rep: true },
  })

  if (!visit) notFound()

  return (
    <div className="max-w-2xl space-y-5">
      <Link
        href="/visits"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <ArrowLeft size={15} />
        Back to Visits
      </Link>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {visit.rep.name} - {visit.rep.zone}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Package size={15} className="text-emerald-600" />
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
              Products Discussed
            </p>
          </div>
          {visit.productsDiscussed.length > 0 ? (
            <div className="space-y-1.5">
              {visit.productsDiscussed.map((product) => (
                <div key={product} className="rounded-lg bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
                  {product}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">None recorded</p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-600" />
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
              Samples Given
            </p>
          </div>
          {visit.samplesGiven.length > 0 ? (
            <div className="space-y-1.5">
              {visit.samplesGiven.map((sample) => (
                <div key={sample} className="rounded-lg bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
                  {sample}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">None given</p>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
        {visit.followUpDate && (
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <Calendar size={15} className="text-emerald-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
                Follow-up Date
              </p>
            </div>
            <p className="text-sm text-zinc-700">{formatDate(visit.followUpDate)}</p>
          </div>
        )}

        {visit.notes && (
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <MessageSquare size={15} className="text-emerald-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
                Visit Notes
              </p>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600">{visit.notes}</p>
          </div>
        )}
      </div>

      {visit.transcript && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Mic size={15} className="text-emerald-600" />
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
              Voice Transcript
            </p>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-500">
            {visit.transcript}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <div
          className={cn(
            "size-1.5 rounded-full",
            visit.smsSent ? "bg-emerald-500" : "bg-zinc-300"
          )}
        />
        {visit.smsSent ? "SMS confirmation sent to rep" : "SMS not sent"}
      </div>
    </div>
  )
}

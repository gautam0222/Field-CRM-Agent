import { prisma }    from "@/lib/prisma"
import { notFound }  from "next/navigation"
import Link          from "next/link"
import { formatDate, formatDateTime, sentimentColor, sentimentLabel, cn } from "@/lib/utils"
import { ArrowLeft, Phone, MapPin, Calendar } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function RepDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const rep = await prisma.rep.findUnique({
    where:   { id },
    include: {
      visits: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { visits: true } },
    },
  })

  if (!rep) notFound()

  const positiveVisits = rep.visits.filter((v) => v.sentiment === "positive").length
  const sentimentRate  = rep._count.visits > 0
    ? Math.round((positiveVisits / rep._count.visits) * 100)
    : 0

  return (
    <div className="max-w-3xl space-y-5">

      <Link
        href="/reps"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Reps
      </Link>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-lg font-bold text-emerald-700">
                {rep.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">{rep.name}</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Phone size={12} /> {rep.phone}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin size={12} /> {rep.zone}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Calendar size={12} /> Since {formatDate(rep.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Trigger call button */}
          <a
            href={`tel:${rep.phone}`}
            className="inline-flex items-center rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <Phone size={14} className="mr-1.5" />
            Call
          </a>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-zinc-100">
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">Total Visits</p>
            <p className="text-2xl font-bold text-zinc-900">{rep._count.visits}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">Positive Rate</p>
            <p className="text-2xl font-bold text-emerald-600">{sentimentRate}%</p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">Email</p>
            <p className="text-sm text-zinc-600 truncate">{rep.email ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Visit history */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-800">Visit History</h3>
        </div>
        <div className="divide-y divide-zinc-50">
          {rep.visits.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-400">
              No visits logged yet
            </div>
          )}
          {rep.visits.map((v) => (
            <Link
              key={v.id}
              href={`/visits/${v.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">
                  {v.doctorName ? `Dr. ${v.doctorName}` : "Unknown Doctor"}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {formatDateTime(v.createdAt)}
                </p>
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border font-medium",
                sentimentColor(v.sentiment)
              )}>
                {sentimentLabel(v.sentiment)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
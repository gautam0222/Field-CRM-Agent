import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, Phone } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { cn, formatDate, formatDateTime, sentimentColor, sentimentLabel } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function RepDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const rep = await prisma.rep.findUnique({
    where: { id },
    include: {
      visits: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { visits: true } },
    },
  })

  if (!rep) notFound()

  const positiveVisits = rep.visits.filter((visit) => visit.sentiment === "positive").length
  const sentimentRate =
    rep._count.visits > 0
      ? Math.round((positiveVisits / rep._count.visits) * 100)
      : 0

  return (
    <div className="max-w-3xl space-y-5">
      <Link
        href="/reps"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <ArrowLeft size={15} />
        Back to Reps
      </Link>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-lg font-bold text-emerald-700">
                {rep.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">{rep.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-4">
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

          <a
            href={`tel:${rep.phone}`}
            className="inline-flex items-center rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <Phone size={14} className="mr-1.5" />
            Call
          </a>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-zinc-100 pt-5">
          <div>
            <p className="mb-0.5 text-xs text-zinc-400">Total Visits</p>
            <p className="text-2xl font-bold text-zinc-900">{rep._count.visits}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-zinc-400">Positive Rate</p>
            <p className="text-2xl font-bold text-emerald-600">{sentimentRate}%</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-zinc-400">Email</p>
            <p className="truncate text-sm text-zinc-600">{rep.email ?? "-"}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-800">Visit History</h3>
        </div>
        <div className="divide-y divide-zinc-50">
          {rep.visits.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-400">
              No visits logged yet
            </div>
          )}

          {rep.visits.map((visit) => (
            <Link
              key={visit.id}
              href={`/visits/${visit.id}`}
              className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-zinc-50"
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">
                  {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {formatDateTime(visit.createdAt)}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-medium",
                  sentimentColor(visit.sentiment)
                )}
              >
                {sentimentLabel(visit.sentiment)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

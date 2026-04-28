import { subDays, startOfDay } from "date-fns"
import { AlertTriangle, CheckCircle } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AlertsPage() {
  const threeDaysAgo = subDays(startOfDay(new Date()), 3)

  const allReps = await prisma.rep.findMany({
    include: {
      visits: {
        where: { createdAt: { gte: threeDaysAgo } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { visits: true } },
    },
  })

  const inactiveReps = allReps.filter((rep) => rep.visits.length === 0)
  const activeReps = allReps.filter((rep) => rep.visits.length > 0)

  const negativeVisits = await prisma.visit.findMany({
    where: {
      sentiment: "negative",
      createdAt: { gte: subDays(new Date(), 7) },
    },
    orderBy: { createdAt: "desc" },
    include: { rep: { select: { name: true, zone: true } } },
  })

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Alerts</h2>
        <p className="text-sm text-zinc-500">
          Inactive reps and negative visit signals
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
          <AlertTriangle size={12} />
          {inactiveReps.length} inactive reps
        </div>
        <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700">
          <AlertTriangle size={12} />
          {negativeVisits.length} negative visits this week
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle size={12} />
          {activeReps.length} reps active
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4">
          <AlertTriangle size={15} className="text-red-500" />
          <h3 className="text-sm font-semibold text-zinc-800">
            Inactive Reps - No visits in 3 days
          </h3>
        </div>

        {inactiveReps.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-400">
            All reps are active
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {inactiveReps.map((rep) => (
              <div key={rep.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-semibold text-red-600">
                      {rep.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{rep.name}</p>
                    <p className="text-xs text-zinc-400">
                      {rep.zone} - {rep.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-red-600">No activity</p>
                  <p className="text-xs text-zinc-400">
                    {rep._count.visits} total visits
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4">
          <AlertTriangle size={15} className="text-yellow-500" />
          <h3 className="text-sm font-semibold text-zinc-800">
            Negative Visits - Last 7 days
          </h3>
        </div>

        {negativeVisits.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-400">
            No negative visits this week
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {negativeVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {visit.rep?.name} - {visit.rep?.zone}
                  </p>
                  {visit.notes && (
                    <p className="mt-0.5 max-w-sm truncate text-xs text-zinc-400">
                      {visit.notes}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-xs text-zinc-400">
                  {formatDate(visit.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

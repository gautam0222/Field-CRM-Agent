import { prisma }    from "@/lib/prisma"
import { subDays, startOfDay } from "date-fns"
import { formatDate }          from "@/lib/utils"
import { AlertTriangle, CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AlertsPage() {
  const threeDaysAgo = subDays(startOfDay(new Date()), 3)

  // Reps with zero visits in the last 3 days
  const allReps = await prisma.rep.findMany({
    include: {
      visits: {
        where:   { createdAt: { gte: threeDaysAgo } },
        orderBy: { createdAt: "desc" },
        take:    1,
      },
      _count: { select: { visits: true } },
    },
  })

  const inactiveReps = allReps.filter((r) => r.visits.length === 0)
  const activeReps   = allReps.filter((r) => r.visits.length > 0)

  // Visits with negative sentiment in last 7 days
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

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <AlertTriangle size={12} />
          {inactiveReps.length} inactive reps
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <AlertTriangle size={12} />
          {negativeVisits.length} negative visits this week
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <CheckCircle size={12} />
          {activeReps.length} reps active
        </div>
      </div>

      {/* Inactive reps */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
          <AlertTriangle size={15} className="text-red-500" />
          <h3 className="text-sm font-semibold text-zinc-800">
            Inactive Reps — No visits in 3 days
          </h3>
        </div>

        {inactiveReps.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-400">
            All reps are active 🎉
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {inactiveReps.map((rep) => (
              <div
                key={rep.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-red-600">
                      {rep.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{rep.name}</p>
                    <p className="text-xs text-zinc-400">{rep.zone} · {rep.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-red-600 font-medium">No activity</p>
                  <p className="text-xs text-zinc-400">{rep._count.visits} total visits</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Negative visits */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
          <AlertTriangle size={15} className="text-yellow-500" />
          <h3 className="text-sm font-semibold text-zinc-800">
            Negative Visits — Last 7 days
          </h3>
        </div>

        {negativeVisits.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-400">
            No negative visits this week 👍
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {negativeVisits.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    {v.doctorName ? `Dr. ${v.doctorName}` : "Unknown Doctor"}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {v.rep?.name} · {v.rep?.zone}
                  </p>
                  {v.notes && (
                    <p className="text-xs text-zinc-400 mt-0.5 max-w-sm truncate">
                      {v.notes}
                    </p>
                  )}
                </div>
                <p className="text-xs text-zinc-400 shrink-0">
                  {formatDate(v.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

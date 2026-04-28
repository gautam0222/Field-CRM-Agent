import { prisma }      from "@/lib/prisma"
import { StatsGrid }   from "@/components/dashboard/stats-grid"
import { VisitFeed }   from "@/components/dashboard/visit-feed"
import { formatDate }  from "@/lib/utils"
import { Visit }       from "@/types/visit"
import { startOfDay }  from "date-fns"
import type { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

type RecentVisit = Prisma.VisitGetPayload<{
  include: { rep: { select: { id: true; name: true; zone: true } } }
}>

export default async function DashboardPage() {
  const today = startOfDay(new Date())

  let totalVisits = 0
  let todayVisits = 0
  let totalReps = 0
  let positiveCount = 0
  let rawRecent: RecentVisit[] = []

  const [
    totalVisitsResult,
    todayVisitsResult,
    totalRepsResult,
    rawRecentResult,
    positiveCountResult,
  ] = await Promise.allSettled([
    prisma.visit.count(),
    prisma.visit.count({ where: { createdAt: { gte: today } } }),
    prisma.rep.count(),
    prisma.visit.findMany({
      take:    10,
      orderBy: { createdAt: "desc" },
      include: { rep: { select: { id: true, name: true, zone: true } } },
    }),
    prisma.visit.count({
      where: { sentiment: "positive", createdAt: { gte: today } },
    }),
  ])

  totalVisits = totalVisitsResult.status === "fulfilled" ? totalVisitsResult.value : 0
  todayVisits = todayVisitsResult.status === "fulfilled" ? todayVisitsResult.value : 0
  totalReps = totalRepsResult.status === "fulfilled" ? totalRepsResult.value : 0
  rawRecent = rawRecentResult.status === "fulfilled" ? rawRecentResult.value : []
  positiveCount = positiveCountResult.status === "fulfilled" ? positiveCountResult.value : 0

  const stats = [
    {
      label: "Total Visits",
      value: totalVisits,
      sub:   "all time",
    },
    {
      label: "Today's Visits",
      value: todayVisits,
      sub:   formatDate(new Date()),
      color: "text-emerald-600",
    },
    {
      label: "Active Reps",
      value: totalReps,
      sub:   "registered",
    },
    {
      label: "Positive Sentiment",
      value: todayVisits > 0
        ? `${Math.round((positiveCount / todayVisits) * 100)}%`
        : "—",
      sub:   "today",
      color: "text-emerald-600",
    },
  ]

  // Serialize dates for client components
  const recentVisits: Visit[] = rawRecent.map((v) => ({
    ...v,
    sentiment: v.sentiment as Visit["sentiment"],
    followUpDate: v.followUpDate?.toISOString() ?? null,
    createdAt:    v.createdAt.toISOString(),
    rep: v.rep
      ? { ...v.rep, zone: v.rep.zone }
      : undefined,
  }))

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Overview</h2>
        <p className="text-sm text-zinc-500">
          Real-time field visit tracking · {formatDate(new Date())}
        </p>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Recent visits */}
      <div className="bg-white rounded-xl border border-zinc-200">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-800">Recent Visits</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Latest field activity</p>
        </div>
        <div className="p-3">
          <VisitFeed visits={recentVisits} />
        </div>
      </div>
    </div>
  )
}

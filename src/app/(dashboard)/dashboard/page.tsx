import type { Prisma } from "@prisma/client"
import { startOfDay } from "date-fns"

import { StatsGrid } from "@/components/dashboard/stats-grid"
import { VisitFeed } from "@/components/dashboard/visit-feed"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import type { Visit } from "@/types/visit"

export const dynamic = "force-dynamic"

type RecentVisit = Prisma.VisitGetPayload<{
  include: { rep: { select: { id: true; name: true; zone: true } } }
}>

export default async function DashboardPage() {
  const today = startOfDay(new Date())

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
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { rep: { select: { id: true, name: true, zone: true } } },
    }),
    prisma.visit.count({
      where: { sentiment: "positive", createdAt: { gte: today } },
    }),
  ])

  const totalVisits =
    totalVisitsResult.status === "fulfilled" ? totalVisitsResult.value : 0
  const todayVisits =
    todayVisitsResult.status === "fulfilled" ? todayVisitsResult.value : 0
  const totalReps =
    totalRepsResult.status === "fulfilled" ? totalRepsResult.value : 0
  const rawRecent: RecentVisit[] =
    rawRecentResult.status === "fulfilled" ? rawRecentResult.value : []
  const positiveCount =
    positiveCountResult.status === "fulfilled" ? positiveCountResult.value : 0

  const stats = [
    {
      label: "Total Visits",
      value: totalVisits,
      sub: "all time",
    },
    {
      label: "Today's Visits",
      value: todayVisits,
      sub: formatDate(new Date()),
      color: "text-emerald-600",
    },
    {
      label: "Active Reps",
      value: totalReps,
      sub: "registered",
    },
    {
      label: "Positive Sentiment",
      value:
        todayVisits > 0
          ? `${Math.round((positiveCount / todayVisits) * 100)}%`
          : "-",
      sub: "today",
      color: "text-emerald-600",
    },
  ]

  const recentVisits: Visit[] = rawRecent.map((visit) => ({
    ...visit,
    sentiment: visit.sentiment as Visit["sentiment"],
    followUpDate: visit.followUpDate?.toISOString() ?? null,
    createdAt: visit.createdAt.toISOString(),
    rep: visit.rep
      ? { id: visit.rep.id, name: visit.rep.name, zone: visit.rep.zone }
      : undefined,
  }))

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Overview</h2>
        <p className="text-sm text-zinc-500">
          Real-time field visit tracking - {formatDate(new Date())}
        </p>
      </div>

      <StatsGrid stats={stats} />

      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-800">Recent Visits</h3>
          <p className="mt-0.5 text-xs text-zinc-400">Latest field activity</p>
        </div>
        <div className="p-3">
          <VisitFeed visits={recentVisits} />
        </div>
      </div>
    </div>
  )
}

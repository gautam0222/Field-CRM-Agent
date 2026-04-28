import { Activity, CheckCircle, Clock } from "lucide-react"

interface RepStatsProps {
  totalVisits: number
  positiveVisits: number
  latestVisit?: string | null
}

export function RepStats({
  totalVisits,
  positiveVisits,
  latestVisit,
}: RepStatsProps) {
  const positiveRate =
    totalVisits > 0 ? Math.round((positiveVisits / totalVisits) * 100) : 0

  const stats = [
    {
      label: "Total Visits",
      value: totalVisits,
      icon: Activity,
      tone: "text-zinc-700",
    },
    {
      label: "Positive Rate",
      value: `${positiveRate}%`,
      icon: CheckCircle,
      tone: "text-emerald-600",
    },
    {
      label: "Latest Visit",
      value: latestVisit ?? "No visits",
      icon: Clock,
      tone: "text-zinc-700",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <Icon size={14} className={stat.tone} />
              {stat.label}
            </div>
            <p className="mt-2 truncate text-xl font-bold text-zinc-900">
              {stat.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}

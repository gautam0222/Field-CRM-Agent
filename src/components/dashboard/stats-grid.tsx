import { cn } from "@/lib/utils"

interface Stat {
  label:  string
  value:  string | number
  sub?:   string
  color?: string
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-zinc-200 px-5 py-4"
        >
          <p className="text-xs text-zinc-500 font-medium mb-1">{s.label}</p>
          <p className={cn("text-2xl font-bold text-zinc-900", s.color)}>
            {s.value}
          </p>
          {s.sub && (
            <p className="text-xs text-zinc-400 mt-0.5">{s.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
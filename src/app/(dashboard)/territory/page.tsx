import { prisma }  from "@/lib/prisma"
import { ZONES }   from "@/config/constants"
import { Visit }   from "@/types/visit"
import { TerritoryMapDynamic } from "@/components/maps/map-wrapper"

export const dynamic = "force-dynamic"

export default async function TerritoryPage() {
  const rawVisits = await prisma.visit.findMany({
    orderBy: { createdAt: "desc" },
    include: { rep: { select: { id: true, name: true, zone: true } } },
  })

  // Zone coverage stats
  const zoneCoverage = ZONES.map((zone) => {
    const zoneVisits = rawVisits.filter((v) => v.rep?.zone === zone)
    return {
      zone,
      total:    zoneVisits.length,
      positive: zoneVisits.filter((v) => v.sentiment === "positive").length,
    }
  })

  const isVisitSentiment = (
    value: string | null
  ): value is NonNullable<Visit["sentiment"]> =>
    value === "positive" || value === "neutral" || value === "negative"

  const visits: Visit[] = rawVisits.map((v) => ({
    ...v,
    sentiment: isVisitSentiment(v.sentiment) ? v.sentiment : null,
    followUpDate: v.followUpDate?.toISOString() ?? null,
    createdAt:    v.createdAt.toISOString(),
    rep: v.rep
      ? { id: v.rep.id, name: v.rep.name, zone: v.rep.zone }
      : undefined,
  }))

  return (
    <div className="max-w-5xl space-y-5">

      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Territory</h2>
        <p className="text-sm text-zinc-500">Zone-wise coverage across Maharashtra</p>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3">
        <TerritoryMapDynamic visits={visits} zones={ZONES} />
      </div>

      {/* Zone breakdown table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-800">Zone Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">Zone</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Total Visits</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Positive</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {zoneCoverage.map((z, i) => {
              const rate = z.total > 0
                ? Math.round((z.positive / z.total) * 100)
                : 0

              return (
                <tr
                  key={z.zone}
                  className={i < zoneCoverage.length - 1 ? "border-b border-zinc-50" : ""}
                >
                  <td className="px-5 py-3 font-medium text-zinc-800">{z.zone}</td>
                  <td className="px-4 py-3 text-zinc-600">{z.total}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{z.positive}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-zinc-100 rounded-full h-1.5 max-w-20">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">{rate}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
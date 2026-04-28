import { prisma }     from "@/lib/prisma"
import Link           from "next/link"
import { formatDateTime, sentimentColor, sentimentLabel, cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function VisitsPage() {
  const visits = await prisma.visit.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      rep: { select: { name: true, zone: true } },
    },
  })

  return (
    <div className="max-w-5xl space-y-5">

      <div>
        <h2 className="text-lg font-semibold text-zinc-900">All Visits</h2>
        <p className="text-sm text-zinc-500">{visits.length} visits logged</p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Rep</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Zone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Products</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Sentiment</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400 text-sm">
                    No visits yet. Visits appear here after reps log calls.
                  </td>
                </tr>
              )}
              {visits.map((v, i) => (
                <tr
                  key={v.id}
                  className={cn(
                    "border-b border-zinc-50 hover:bg-zinc-50 transition-colors",
                    i === visits.length - 1 && "border-0"
                  )}
                >
                  <td className="px-5 py-3 font-medium text-zinc-800">
                    {v.doctorName ? `Dr. ${v.doctorName}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{v.rep?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">{v.rep?.zone ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {v.productsDiscussed.length > 0
                      ? v.productsDiscussed.slice(0, 2).join(", ") +
                        (v.productsDiscussed.length > 2 ? ` +${v.productsDiscussed.length - 2}` : "")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border font-medium",
                      sentimentColor(v.sentiment)
                    )}>
                      {sentimentLabel(v.sentiment)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {formatDateTime(v.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/visits/${v.id}`}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

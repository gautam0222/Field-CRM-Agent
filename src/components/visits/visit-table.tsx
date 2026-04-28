import Link from "next/link"

import { cn, formatDateTime, sentimentColor, sentimentLabel } from "@/lib/utils"
import type { Visit } from "@/types/visit"

interface VisitTableProps {
  visits: Visit[]
}

export function VisitTable({ visits }: VisitTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Rep</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Zone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Sentiment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-zinc-400">
                  No visits yet.
                </td>
              </tr>
            ) : (
              visits.map((visit, index) => (
                <tr
                  key={visit.id}
                  className={cn(
                    "border-b border-zinc-50 transition-colors hover:bg-zinc-50",
                    index === visits.length - 1 && "border-0"
                  )}
                >
                  <td className="px-5 py-3 font-medium text-zinc-800">
                    {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unknown Doctor"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {visit.rep?.name ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {visit.rep?.zone ?? "No zone"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        sentimentColor(visit.sentiment)
                      )}
                    >
                      {sentimentLabel(visit.sentiment)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {formatDateTime(visit.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/visits/${visit.id}`}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

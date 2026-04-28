import Link from "next/link"
import { UserPlus } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { cn, formatDate } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function RepsPage() {
  const reps = await prisma.rep.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { visits: true } },
    },
  })

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Reps</h2>
          <p className="text-sm text-zinc-500">
            {reps.length} field reps registered
          </p>
        </div>
        <Link
          href="/reps/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <UserPlus size={15} />
          Add Rep
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Visits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {reps.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-zinc-400">
                    No reps yet. Add your first field rep to get started.
                  </td>
                </tr>
              )}

              {reps.map((rep, index) => (
                <tr
                  key={rep.id}
                  className={cn(
                    "border-b border-zinc-50 transition-colors hover:bg-zinc-50",
                    index === reps.length - 1 && "border-0"
                  )}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <span className="text-xs font-semibold text-emerald-700">
                          {rep.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-zinc-800">{rep.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {rep.phone}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                      {rep.zone}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-700">
                    {rep._count.visits}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {formatDate(rep.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/reps/${rep.id}`}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      View
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

import { prisma }   from "@/lib/prisma"
import Link         from "next/link"
import { formatDate, cn } from "@/lib/utils"
import { UserPlus } from "lucide-react"

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
          <p className="text-sm text-zinc-500">{reps.length} field reps registered</p>
        </div>
        <Link
          href="/reps/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <UserPlus size={15} />
          Add Rep
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Zone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Visits</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {reps.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-sm">
                    No reps yet. Add your first field rep to get started.
                  </td>
                </tr>
              )}
              {reps.map((rep, i) => (
                <tr
                  key={rep.id}
                  className={cn(
                    "border-b border-zinc-50 hover:bg-zinc-50 transition-colors",
                    i === reps.length - 1 && "border-0"
                  )}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-emerald-700">
                          {rep.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-zinc-800">{rep.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{rep.phone}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md font-medium">
                      {rep.zone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-700 font-semibold">
                    {rep._count.visits}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {formatDate(rep.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/reps/${rep.id}`}
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
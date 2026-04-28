import Link from "next/link"
import { MapPin, Phone } from "lucide-react"

import type { Rep } from "@/types/rep"
import { formatDate } from "@/lib/utils"

interface RepCardProps {
  rep: Rep
}

export function RepCard({ rep }: RepCardProps) {
  return (
    <Link
      href={`/reps/${rep.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-sm font-semibold text-emerald-700">
            {rep.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {rep.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Joined {formatDate(rep.createdAt)}
              </p>
            </div>
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
              {rep._count?.visits ?? 0} visits
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <Phone size={12} />
              {rep.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} />
              {rep.zone}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

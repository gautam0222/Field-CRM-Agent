import { MessageSquare } from "lucide-react"

import { formatDateTime } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function SMSLogPage() {
  const messages = await prisma.mockSMS.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Mock SMS Log</h2>
        <p className="text-sm text-zinc-500">
          Simulated SMS confirmations sent to reps after each visit
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <MessageSquare size={14} className="mt-0.5 shrink-0" />
        <span>
          In production these would be real SMS messages via Twilio. For this
          demo they are logged here instead - zero cost.
        </span>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-400">
            No messages yet. They appear here after reps log visits.
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100">
                  <MessageSquare size={12} className="text-emerald-600" />
                </div>
                <span className="font-mono text-xs font-medium text-zinc-700">
                  {msg.to}
                </span>
              </div>
              <span className="text-xs text-zinc-400">
                {formatDateTime(msg.createdAt)}
              </span>
            </div>

            <p className="whitespace-pre-wrap pl-8 text-sm leading-relaxed text-zinc-600">
              {msg.body}
            </p>

            <div className="mt-2 pl-8">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Delivered (mock)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

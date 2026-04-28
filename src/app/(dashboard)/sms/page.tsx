import { prisma }      from "@/lib/prisma"
import { formatDateTime } from "@/lib/utils"
import { MessageSquare }  from "lucide-react"

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

      {/* Demo notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
        <MessageSquare size={14} className="mt-0.5 shrink-0" />
        <span>
          In production these would be real SMS messages via Twilio.
          For this demo they are logged here instead — zero cost.
        </span>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 py-12 text-center text-sm text-zinc-400">
            No messages yet. They appear here after reps log visits.
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white rounded-xl border border-zinc-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MessageSquare size={12} className="text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-zinc-700 font-mono">
                  {msg.to}
                </span>
              </div>
              <span className="text-xs text-zinc-400">
                {formatDateTime(msg.createdAt)}
              </span>
            </div>

            <p className="text-sm text-zinc-600 whitespace-pre-wrap leading-relaxed pl-8">
              {msg.body}
            </p>

            <div className="pl-8 mt-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                ✓ Delivered (mock)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
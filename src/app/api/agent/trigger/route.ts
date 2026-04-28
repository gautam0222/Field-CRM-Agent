import { NextRequest, NextResponse } from "next/server"
import { prisma }          from "@/lib/prisma"
import { triggerBolnaCall } from "@/lib/bolna"
import { z }               from "zod"

const TriggerSchema = z.object({
  repId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = TriggerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "repId is required" }, { status: 400 })
    }

    const rep = await prisma.rep.findUnique({
      where: { id: parsed.data.repId },
    })

    if (!rep) {
      return NextResponse.json({ error: "Rep not found" }, { status: 404 })
    }

    const result = await triggerBolnaCall({
      agentId: process.env.BOLNA_AGENT_ID!,
      toPhone: rep.phone,
      repName: rep.name,
    })

    if (!result) {
      return NextResponse.json(
        { error: "Failed to trigger Bolna call" },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      callId:  result.callId,
      rep:     { name: rep.name, phone: rep.phone },
    })

  } catch (err) {
    console.error("[POST /api/agent/trigger]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
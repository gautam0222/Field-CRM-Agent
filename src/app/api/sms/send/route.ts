import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { sendSMS } from "@/lib/twilio"

const SendSMSSchema = z.object({
  to: z.string().min(1),
  body: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const parsed = SendSMSSchema.safeParse(await req.json())

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await sendSMS(parsed.data.to, parsed.data.body)
    return NextResponse.json(result)
  } catch (err) {
    console.error("[POST /api/sms/send]", err)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}

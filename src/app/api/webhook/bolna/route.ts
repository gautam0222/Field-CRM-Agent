import { NextRequest, NextResponse } from "next/server"
import { prisma }           from "@/lib/prisma"
import { extractEntities }  from "@/lib/extract-entities"
import { sendSMS, buildVisitSMS } from "@/lib/twilio"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Bolna sends transcript + metadata in the webhook payload
    const transcript: string  = body?.data?.transcript ?? body?.transcript ?? ""
    const repPhone:   string  = body?.data?.recipient_phone_no ?? body?.recipient_phone_no ?? ""
    const callId:     string  = body?.data?.call_id ?? body?.call_id ?? ""

    if (!transcript || !repPhone) {
      return NextResponse.json({ error: "Missing transcript or phone" }, { status: 400 })
    }

    // 1. Find the rep by phone number
    const rep = await prisma.rep.findUnique({ where: { phone: repPhone } })
    if (!rep) {
      console.warn(`[webhook] No rep found for phone: ${repPhone}`)
      return NextResponse.json({ error: "Rep not found" }, { status: 404 })
    }

    // 2. Extract structured data from transcript using Gemini
    const entities = await extractEntities(transcript)

    // 3. Parse follow-up date safely
    const followUpDate = entities.followUpDate
      ? new Date(entities.followUpDate)
      : null

    // 4. Save visit to DB
    const visit = await prisma.visit.create({
      data: {
        repId:             rep.id,
        doctorName:        entities.doctorName,
        productsDiscussed: entities.productsDiscussed,
        samplesGiven:      entities.samplesGiven,
        followUpDate,
        notes:             entities.notes,
        sentiment:         entities.sentiment,
        transcript,
        smsSent:           false,
      },
    })

    // 5. Send mock SMS confirmation to rep
    const smsBody = buildVisitSMS({
      repName:    rep.name,
      doctorName: entities.doctorName,
      products:   entities.productsDiscussed,
      followUp:   entities.followUpDate,
    })

    await sendSMS(rep.phone, smsBody)

    await prisma.visit.update({
      where: { id: visit.id },
      data:  { smsSent: true },
    })

    console.log(`[webhook] Visit logged for ${rep.name} — call ${callId}`)
    return NextResponse.json({ success: true, visitId: visit.id })

  } catch (err) {
    console.error("[webhook] error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
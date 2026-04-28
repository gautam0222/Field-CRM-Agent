import { NextResponse } from "next/server"

import { ZONES } from "@/config/constants"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const visits = await prisma.visit.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        rep: { select: { id: true, name: true, zone: true } },
      },
    })

    const zones = ZONES.map((zone) => {
      const zoneVisits = visits.filter((visit) => visit.rep?.zone === zone)

      return {
        zone,
        total: zoneVisits.length,
        positive: zoneVisits.filter((visit) => visit.sentiment === "positive").length,
      }
    })

    return NextResponse.json({ zones, visits })
  } catch (err) {
    console.error("[GET /api/territory]", err)
    return NextResponse.json(
      { error: "Failed to fetch territory data" },
      { status: 500 }
    )
  }
}

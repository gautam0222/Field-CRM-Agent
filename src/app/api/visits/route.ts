import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repId = searchParams.get("repId")
    const limit = parseInt(searchParams.get("limit") ?? "50")

    const visits = await prisma.visit.findMany({
      where:   repId ? { repId } : {},
      orderBy: { createdAt: "desc" },
      take:    limit,
      include: {
        rep: { select: { id: true, name: true, zone: true } },
      },
    })

    return NextResponse.json({ visits })
  } catch (err) {
    console.error("[GET /api/visits]", err)
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 })
  }
}
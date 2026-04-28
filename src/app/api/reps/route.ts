import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z }     from "zod"

const CreateRepSchema = z.object({
  name:  z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  zone:  z.string().min(1),
})

export async function GET() {
  try {
    const reps = await prisma.rep.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { visits: true } } },
    })
    return NextResponse.json({ reps })
  } catch (err) {
    console.error("[GET /api/reps]", err)
    return NextResponse.json({ error: "Failed to fetch reps" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = CreateRepSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const existing = await prisma.rep.findUnique({
      where: { phone: parsed.data.phone },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A rep with this phone number already exists" },
        { status: 409 }
      )
    }

    const rep = await prisma.rep.create({ data: parsed.data })
    return NextResponse.json({ rep }, { status: 201 })

  } catch (err) {
    console.error("[POST /api/reps]", err)
    return NextResponse.json({ error: "Failed to create rep" }, { status: 500 })
  }
}
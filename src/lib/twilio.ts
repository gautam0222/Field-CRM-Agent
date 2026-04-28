import { prisma } from "@/lib/prisma"

export async function sendSMS(to: string, body: string): Promise<{ success: boolean }> {
  // Mock SMS: logs to console and saves to DB for demo visibility.
  console.log(`[MOCK SMS] -> ${to}: ${body}`)

  await prisma.mockSMS.create({
    data: { to, body },
  })

  return { success: true }
}

export function buildVisitSMS(params: {
  repName: string
  doctorName: string | null
  products: string[]
  followUp: string | null
}): string {
  const { repName, doctorName, products, followUp } = params

  const lines = [
    `Visit logged - ${repName}`,
    doctorName ? `Dr. ${doctorName}` : null,
    products.length ? `Products: ${products.join(", ")}` : null,
    followUp ? `Follow-up: ${followUp}` : null,
  ].filter(Boolean)

  return lines.join("\n")
}

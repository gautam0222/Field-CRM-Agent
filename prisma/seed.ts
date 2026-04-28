import "dotenv/config"
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

// Fix 1: disable SSL cert verification for Supabase pooler
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma  = new PrismaClient({ adapter })

const REPS = [
  { name: "Raj Sharma",   phone: "+919876543210", zone: "Mumbai North", email: "raj@fieldcrm.demo"    },
  { name: "Priya Mehta",  phone: "+919876543211", zone: "Mumbai South", email: "priya@fieldcrm.demo"  },
  { name: "Arjun Nair",   phone: "+919876543212", zone: "Pune",         email: "arjun@fieldcrm.demo"  },
  { name: "Sneha Patil",  phone: "+919876543213", zone: "Nashik",       email: "sneha@fieldcrm.demo"  },
  { name: "Vikram Singh", phone: "+919876543214", zone: "Nagpur",       email: "vikram@fieldcrm.demo" },
]

const DOCTORS  = ["Anand Kulkarni", "Sunita Desai", "Ramesh Joshi", "Meera Iyer", "Praveen Ghadge"]
const PRODUCTS = [
  ["Azithromycin 500mg", "Pantoprazole 40mg"],
  ["Amoxicillin 250mg"],
  ["Metformin 500mg", "Atorvastatin 10mg"],
  ["Cefixime 200mg"],
]

// Fix 2: mutable array, no "as const"
const SENTIMENTS = ["positive", "positive", "positive", "neutral", "negative"]

const NOTES = [
  "Doctor was receptive. Interested in new dosage format.",
  "Short visit, doctor was busy. Left samples and brochure.",
  "Good discussion on patient outcomes. Follow-up scheduled.",
  "Doctor requested more clinical data before prescribing.",
  "Receptionist said doctor not meeting reps this week.",
]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function daysAgo(n: number):   Date { const d = new Date(); d.setDate(d.getDate() - n); return d }
function daysAhead(n: number): Date { const d = new Date(); d.setDate(d.getDate() + n); return d }
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

async function main() {
  console.log("🌱 Seeding…")

  await prisma.mockSMS.deleteMany()
  await prisma.visit.deleteMany()
  await prisma.rep.deleteMany()

  const reps = await Promise.all(REPS.map((r) => prisma.rep.create({ data: r })))
  console.log(`✅ ${reps.length} reps created`)

  let count = 0
  for (const rep of reps) {
    const n = Math.floor(Math.random() * 6) + 4
    for (let i = 0; i < n; i++) {
      const products = pick(PRODUCTS)
      await prisma.visit.create({
        data: {
          repId:             rep.id,
          doctorName:        pick(DOCTORS),
          productsDiscussed: products,
          samplesGiven:      [products[0]],
          followUpDate:      Math.random() > 0.5 ? daysAhead(7) : null,
          notes:             pick(NOTES),
          sentiment:         pick(SENTIMENTS),
          transcript:        `Rep: Hello Doctor, I'm ${rep.name}. I'd like to discuss ${products[0]}. Doctor: Sure, leave me the samples.`,
          smsSent:           true,
          createdAt:         daysAgo(Math.floor(Math.random() * 14)),
        },
      })
      count++
    }

    const products = pick(PRODUCTS)
    await prisma.mockSMS.create({
      data: {
        to:   rep.phone,
        body: `✅ Visit logged — ${rep.name}\nDr. ${pick(DOCTORS)}\nProducts: ${products.join(", ")}\nFollow-up: ${fmtDate(daysAhead(7))}`,
      },
    })
  }

  console.log(`✅ ${count} visits created`)
  console.log(`✅ ${reps.length} mock SMSes created`)
  console.log("🎉 Done!")
  await prisma.$disconnect()
  await pool.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
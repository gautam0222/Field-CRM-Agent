import { GoogleGenerativeAI } from "@google/generative-ai"
import { ENTITY_EXTRACTION_PROMPT } from "@/config/prompts"

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" })

export interface ExtractedVisit {
  doctorName:        string | null
  clinicName:        string | null
  productsDiscussed: string[]
  samplesGiven:      string[]
  followUpDate:      string | null
  notes:             string | null
  sentiment:         "positive" | "neutral" | "negative"
}

export async function extractEntities(transcript: string): Promise<ExtractedVisit> {
  const prompt = `${ENTITY_EXTRACTION_PROMPT}\n\nTranscript:\n${transcript}`

  try {
    const result = await model.generateContent(prompt)
    const text   = result.response.text().trim()

    // Strip markdown code fences if Gemini wraps it
    const clean = text.replace(/```json|```/g, "").trim()
    return JSON.parse(clean) as ExtractedVisit

  } catch (err) {
    console.error("[extractEntities] failed:", err)

    // Return safe defaults so the visit still gets saved
    return {
      doctorName:        null,
      clinicName:        null,
      productsDiscussed: [],
      samplesGiven:      [],
      followUpDate:      null,
      notes:             transcript.slice(0, 200),
      sentiment:         "neutral",
    }
  }
}
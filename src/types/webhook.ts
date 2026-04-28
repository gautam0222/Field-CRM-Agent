import type { Sentiment } from "@/types/visit"

export interface BolnaWebhookPayload {
  data?: {
    transcript?: string
    recipient_phone_no?: string
    call_id?: string
    [key: string]: unknown
  }
  transcript?: string
  recipient_phone_no?: string
  call_id?: string
  [key: string]: unknown
}

export interface ExtractedWebhookVisit {
  doctorName: string | null
  clinicName: string | null
  productsDiscussed: string[]
  samplesGiven: string[]
  followUpDate: string | null
  notes: string | null
  sentiment: Sentiment
}

export interface WebhookResult {
  success: boolean
  visitId?: string
  error?: string
}

export type Sentiment = "positive" | "neutral" | "negative"

export interface Visit {
  id:                string
  repId:             string
  outletId:          string | null
  doctorName:        string | null
  productsDiscussed: string[]
  samplesGiven:      string[]
  followUpDate:      string | null
  notes:             string | null
  sentiment:         Sentiment | null
  transcript:        string | null
  smsSent:           boolean
  createdAt:         string
  rep?: {
    id:   string
    name: string
    zone: string
  }
}

export interface CreateVisitInput {
  repId:             string
  doctorName?:       string
  productsDiscussed: string[]
  samplesGiven:      string[]
  followUpDate?:     string
  notes?:            string
  sentiment?:        Sentiment
  transcript?:       string
}
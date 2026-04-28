export const APP_NAME = "FieldCRM"
export const APP_DESCRIPTION = "Voice-first field sales CRM"

export const ZONES = [
  "Mumbai North",
  "Mumbai South",
  "Pune",
  "Nashik",
  "Nagpur",
  "Aurangabad",
]

export const PRODUCTS = [
  "Azithromycin 500mg",
  "Amoxicillin 250mg",
  "Pantoprazole 40mg",
  "Metformin 500mg",
  "Atorvastatin 10mg",
  "Cefixime 200mg",
]

export const SENTIMENT_COLORS: Record<string, string> = {
  positive: "text-green-600 bg-green-50",
  neutral:  "text-yellow-600 bg-yellow-50",
  negative: "text-red-600 bg-red-50",
}

export const NAV_LINKS = [
  { href: "/dashboard",  label: "Dashboard" },
  { href: "/visits",     label: "Visits"    },
  { href: "/reps",       label: "Reps"      },
  { href: "/territory",  label: "Territory" },
  { href: "/alerts",     label: "Alerts"    },
  { href: "/sms",        label: "SMS Log"   },
]
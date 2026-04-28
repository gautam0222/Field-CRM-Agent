import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "FieldCRM - Voice-first Field Sales",
  description: "Voice AI powered field sales CRM for pharma reps in India",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  )
}

import { clsx, type ClassValue } from "clsx"
import { format, formatDistanceToNow } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "-"
  return format(new Date(date), "dd MMM yyyy")
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return "-"
  return format(new Date(date), "dd MMM yyyy, h:mm a")
}

export function timeAgo(date: string | Date | null): string {
  if (!date) return "-"
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function sentimentLabel(s: string | null): string {
  if (!s) return "-"
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function sentimentColor(s: string | null): string {
  switch (s) {
    case "positive":
      return "text-emerald-700 bg-emerald-50 border-emerald-200"
    case "negative":
      return "text-red-700 bg-red-50 border-red-200"
    default:
      return "text-yellow-700 bg-yellow-50 border-yellow-200"
  }
}

export function truncate(str: string | null, len = 80): string {
  if (!str) return "-"
  return str.length > len ? `${str.slice(0, len)}...` : str
}

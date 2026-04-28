"use client"

import { usePathname } from "next/navigation"
import { NAV_LINKS }   from "@/config/constants"
import { Bell }        from "lucide-react"

function getPageTitle(pathname: string): string {
  const match = NAV_LINKS.find(
    (l) => pathname === l.href || pathname.startsWith(l.href + "/")
  )
  return match?.label ?? "Field CRM"
}

export function Topbar() {
  const pathname = usePathname()
  const title    = getPageTitle(pathname)

  return (
    <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 z-10">

      <h1 className="text-sm font-semibold text-zinc-800">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Notification bell — static for demo */}
        <button className="relative p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-xs font-medium text-emerald-700">M</span>
          </div>
          <span className="text-sm text-zinc-700 font-medium">Manager</span>
        </div>
      </div>
    </header>
  )
}
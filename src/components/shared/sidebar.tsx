"use client"

import Link      from "next/link"
import { usePathname } from "next/navigation"
import { cn }    from "@/lib/utils"
import { APP_NAME, NAV_LINKS } from "@/config/constants"

import {
  LayoutDashboard,
  MapPin,
  Users,
  Map,
  Bell,
  Mic,
  MessageSquare,
} from "lucide-react"


const ICONS: Record<string, React.ReactNode> = {
  "/dashboard": <LayoutDashboard size={18} />,
  "/visits":    <MapPin          size={18} />,
  "/reps":      <Users           size={18} />,
  "/territory": <Map             size={18} />,
  "/alerts":    <Bell            size={18} />,
  "/sms":       <MessageSquare   size={18} />,
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 border-r border-zinc-200 bg-white flex flex-col z-20">

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-zinc-100">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Mic size={14} className="text-white" />
        </div>
        <span className="font-semibold text-zinc-900 text-sm tracking-tight">
          {APP_NAME}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              {ICONS[link.href]}
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-zinc-100">
        <p className="text-xs text-zinc-400">Field Sales CRM</p>
        <p className="text-xs text-zinc-400">Voice-first · India</p>
      </div>
    </aside>
  )
}
import { Sidebar } from "@/components/shared/sidebar"
import { Topbar }  from "@/components/shared/topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      <Topbar />
      <main className="ml-56 pt-14 p-6 min-h-screen">
        {children}
      </main>
    </div>
  )
}
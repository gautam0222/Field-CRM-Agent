import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  rows?: number
}

export function LoadingSkeleton({ className, rows = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-xl border border-zinc-200 bg-white p-4"
        >
          <div className="h-3 w-1/3 rounded bg-zinc-100" />
          <div className="mt-3 h-2 w-2/3 rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  )
}

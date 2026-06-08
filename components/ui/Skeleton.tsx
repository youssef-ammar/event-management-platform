import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  rounded?: boolean
}

export function Skeleton({ className, rounded }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer',
        rounded ? 'rounded-full' : 'rounded-lg',
        className,
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10" rounded />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-2" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
          <Skeleton className="w-10 h-10" rounded />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonPhotoGrid() {
  const heights = ['h-48', 'h-32', 'h-56', 'h-40', 'h-36', 'h-52', 'h-44', 'h-32']
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
      {heights.map((h, i) => (
        <div key={i} className={cn('rounded-xl mb-3 break-inside-avoid', h)}>
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </div>
  )
}

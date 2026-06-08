import { cn } from '@/lib/utils/cn'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  gradient?: boolean
  bordered?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ className, children, hover, gradient, bordered = true, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl transition-all duration-300',
        bordered && 'border border-gray-100',
        'shadow-sm',
        hover && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        gradient && 'bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30',
        padding === 'none' && 'p-0',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-6',
        padding === 'lg' && 'p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

export function StatCard({
  label, value, icon, trend, colorClass, children,
}: {
  label: string; value: string | number; icon: ReactNode; trend?: number; colorClass?: string; children?: ReactNode
}) {
  return (
    <Card className={cn('relative overflow-hidden', colorClass)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend !== undefined && (
            <p className={cn('text-xs mt-1 font-medium', trend >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% ce mois
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-white/60">{icon}</div>
      </div>
      {children}
    </Card>
  )
}

import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

type BadgeColor = 'green' | 'amber' | 'red' | 'rose' | 'blue' | 'purple' | 'gray' | 'indigo'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
  size?: BadgeSize
  rounded?: boolean
  dot?: boolean
  className?: string
}

const colors: Record<BadgeColor, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const dotColors: Record<BadgeColor, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-400',
  indigo: 'bg-indigo-500',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function Badge({ children, color = 'gray', size = 'md', rounded = true, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border',
        colors[color],
        sizes[size],
        rounded ? 'rounded-full' : 'rounded-md',
        className,
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[color])} />}
      {children}
    </span>
  )
}

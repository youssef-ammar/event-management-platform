import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-400">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>}
      {action && (
        <Button onClick={action.onClick} size="md">{action.label}</Button>
      )}
    </div>
  )
}

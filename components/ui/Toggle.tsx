'use client'

import { cn } from '@/lib/utils/cn'

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  id?: string
}

export function Toggle({ checked, onChange, label, size = 'md', disabled, id }: ToggleProps) {
  const toggleId = id || 'toggle-' + Math.random().toString(36).slice(2)

  return (
    <label htmlFor={toggleId} className={cn('flex items-center gap-2', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
      <div className="relative">
        <input
          id={toggleId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={cn(
            'rounded-full transition-all duration-300',
            size === 'sm' ? 'w-8 h-4' : 'w-11 h-6',
            checked ? 'bg-rose-500' : 'bg-gray-200',
          )}
        />
        <div
          className={cn(
            'absolute top-0.5 rounded-full bg-white shadow-sm transition-all duration-300',
            size === 'sm' ? 'w-3 h-3 left-0.5' : 'w-5 h-5 left-0.5',
            checked
              ? size === 'sm' ? 'translate-x-4' : 'translate-x-5'
              : 'translate-x-0',
          )}
        />
      </div>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  )
}

'use client'

import { cn } from '@/lib/utils/cn'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface DropdownItem {
  label: string
  value: string
  icon?: ReactNode
  danger?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect?: (value: string) => void
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, onSelect, align = 'left', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            'absolute top-full mt-2 z-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 min-w-[160px] animate-slide-down',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          role="menu"
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="my-1 border-t border-gray-100" />}
              <button
                role="menuitem"
                onClick={() => { onSelect?.(item.value); setOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors duration-150',
                  item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                {item.icon && <span className="text-gray-400">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface SelectProps {
  label?: string
  options: { label: string; value: string }[]
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  error?: string
  className?: string
  disabled?: boolean
}

export function Select({ label, options, value, onChange, placeholder, error, className, disabled }: SelectProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full appearance-none border rounded-xl px-4 py-3 pr-10 text-gray-800 bg-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            error ? 'border-red-400' : 'border-gray-200',
            !value && 'text-gray-400',
          )}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}

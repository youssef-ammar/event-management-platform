'use client'

import { cn } from '@/lib/utils/cn'
import { type ReactNode, useState } from 'react'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onChange?: (id: string) => void
  variant?: 'underline' | 'pill'
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, variant = 'underline', className }: TabsProps) {
  const [internal, setInternal] = useState(tabs[0]?.id)
  const active = activeTab ?? internal

  const handleChange = (id: string) => {
    setInternal(id)
    onChange?.(id)
  }

  if (variant === 'pill') {
    return (
      <div className={cn('flex gap-2 flex-wrap', className)} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              active === tab.id
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-semibold', active === tab.id ? 'bg-white/20' : 'bg-gray-200')}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => handleChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 -mb-px',
            active === tab.id
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', active === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500')}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

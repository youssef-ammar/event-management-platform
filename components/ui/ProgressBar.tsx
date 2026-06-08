'use client'

import { cn } from '@/lib/utils/cn'
import { useEffect, useRef, useState } from 'react'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  showPercentage?: boolean
  color?: 'rose' | 'green' | 'amber' | 'blue' | 'purple' | 'champagne'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  label?: string
  className?: string
}

const colors = {
  rose: 'bg-rose-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  champagne: 'bg-[#D4AF7A]',
}

const trackColors = {
  rose: 'bg-rose-100',
  green: 'bg-emerald-100',
  amber: 'bg-amber-100',
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  champagne: 'bg-amber-100',
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function ProgressBar({
  value, max = 100, showLabel, showPercentage, color = 'rose', size = 'md',
  animated = true, label, className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const [width, setWidth] = useState(0)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      requestAnimationFrame(() => setWidth(pct))
    } else {
      setWidth(pct)
    }
  }, [pct])

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm font-semibold text-gray-900">{pct}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', trackColors[color], sizeMap[size])}>
        <div
          className={cn('h-full rounded-full', colors[color], animated && 'transition-all duration-1000 ease-out')}
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{value.toLocaleString('fr-FR')} €</span>
          <span className="text-xs text-gray-500">{max.toLocaleString('fr-FR')} €</span>
        </div>
      )}
    </div>
  )
}

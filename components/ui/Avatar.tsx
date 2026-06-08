import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

interface AvatarProps {
  name?: string
  src?: string
  color?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const DEFAULT_COLORS = [
  '#C9748F', '#D4AF7A', '#7C3AED', '#2563EB', '#059669',
  '#DC2626', '#D97706', '#0891B2', '#9333EA', '#16A34A',
]

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColorFromName(name?: string): string {
  if (!name) return DEFAULT_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length]
}

export function Avatar({ name, src, color, size = 'md', className }: AvatarProps) {
  const bgColor = color || getColorFromName(name)
  const initials = getInitials(name)

  if (src) {
    return (
      <div className={cn('rounded-full overflow-hidden flex-shrink-0 relative', sizes[size], className)}>
        <Image src={src} alt={name || 'Avatar'} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', sizes[size], className)}
      style={{ backgroundColor: bgColor }}
      aria-label={name}
    >
      {initials}
    </div>
  )
}

interface AvatarGroupProps {
  names: string[]
  colors?: string[]
  max?: number
  size?: AvatarProps['size']
}

export function AvatarGroup({ names, colors, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = names.slice(0, max)
  const overflow = names.length - max

  return (
    <div className="flex items-center">
      {visible.map((name, i) => (
        <div key={i} className="-ml-2 first:ml-0 ring-2 ring-white rounded-full">
          <Avatar name={name} color={colors?.[i]} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div className={cn('-ml-2 ring-2 ring-white rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600', sizes[size])}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

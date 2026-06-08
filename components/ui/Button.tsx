'use client'

import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow-md hover:shadow-rose-200/50 active:scale-95',
  secondary: 'bg-[#D4AF7A] hover:bg-[#C89A55] text-white shadow-sm hover:shadow-md active:scale-95',
  outlined: 'border-2 border-rose-500 text-rose-500 hover:bg-rose-50 active:scale-95',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md active:scale-95',
}

const sizes: Record<Size, string> = {
  xs: 'px-3 py-1.5 text-xs gap-1',
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3 text-base gap-2',
  xl: 'px-10 py-4 text-lg gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'

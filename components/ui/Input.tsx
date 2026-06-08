'use client'

import { cn } from '@/lib/utils/cn'
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full border rounded-xl py-3 text-gray-800 placeholder-gray-400 bg-white transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400',
              'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60',
              leftIcon ? 'pl-10 pr-4' : 'px-4',
              rightIcon ? 'pr-10' : '',
              error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  characterCount?: number
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, characterCount, maxLength, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full border rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 bg-white transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200',
            className,
          )}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {error ? <p className="text-sm text-red-500">{error}</p> : helperText ? <p className="text-sm text-gray-500">{helperText}</p> : <span />}
          {maxLength !== undefined && (
            <span className={cn('text-xs', characterCount && characterCount > maxLength * 0.9 ? 'text-amber-500' : 'text-gray-400')}>
              {characterCount ?? 0}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

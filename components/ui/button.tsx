'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 focus-visible:outline-blue-600',
  outline:
    'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-blue-600',
  ghost:
    'text-slate-600 hover:bg-slate-100 focus-visible:outline-blue-600',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantClass[variant], sizeClass[size], fullWidth && 'w-full', className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'


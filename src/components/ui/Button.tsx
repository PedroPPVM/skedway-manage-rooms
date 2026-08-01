import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../utils'
import { Spinner } from './Spinner'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface-elevated text-foreground hover:bg-surface-muted',
  ghost: 'text-foreground hover:bg-surface-muted',
  danger: 'bg-danger text-danger-foreground hover:opacity-90',
} as const

const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm',
} as const

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  )
}

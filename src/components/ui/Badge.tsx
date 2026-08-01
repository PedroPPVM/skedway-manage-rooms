import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../utils'

const variants = {
  success: 'bg-success/15 text-success',
  danger: 'bg-danger/15 text-danger',
  warning: 'bg-warning/15 text-warning',
  neutral: 'bg-surface-muted text-muted-foreground',
  accent: 'bg-accent/40 text-accent-foreground',
} as const

interface BadgeProps extends ComponentPropsWithRef<'span'> {
  variant?: keyof typeof variants
}

export function Badge({
  variant = 'neutral',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

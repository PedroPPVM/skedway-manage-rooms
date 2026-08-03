import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../utils'

interface ToggleChipProps extends ComponentPropsWithRef<'button'> {
  pressed: boolean
}

export function ToggleChip({ pressed, className, ...props }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        pressed
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface-elevated text-foreground hover:bg-surface-muted',
        className,
      )}
      {...props}
    />
  )
}

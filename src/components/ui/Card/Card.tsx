import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../../utils'

export function Card({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface-elevated p-4',
        className,
      )}
      {...props}
    />
  )
}

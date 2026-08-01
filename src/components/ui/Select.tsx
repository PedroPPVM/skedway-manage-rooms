import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../utils'

interface SelectProps extends ComponentPropsWithRef<'select'> {
  label?: string
  error?: string
}

export function Select({
  label,
  error,
  id,
  className,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-10 w-full appearance-none rounded-md border border-border bg-surface-elevated pr-9 pl-3 text-sm text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60',
            error && 'border-danger',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../../utils'

interface CheckboxProps extends ComponentPropsWithRef<'input'> {
  label: string
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <label
      htmlFor={checkboxId}
      className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
    >
      <input
        type="checkbox"
        id={checkboxId}
        className={cn(
          'size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          className,
        )}
        {...props}
      />
      {label}
    </label>
  )
}

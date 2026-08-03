import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../../utils'

export interface MultiSelectOption<T extends string> {
  value: T
  label: string
}

interface MultiSelectProps<T extends string> {
  label: string
  options: MultiSelectOption<T>[]
  value: T[]
  onChange: (value: T[]) => void
  placeholder: string
  className?: string
}

export function MultiSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
}: MultiSelectProps<T>) {
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)

  return (
    <Listbox value={value} onChange={onChange} multiple>
      {({ open }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          <Label className="text-sm font-medium text-foreground">{label}</Label>
          <div className="relative">
            {open && (
              <div
                aria-hidden="true"
                className="fixed inset-0 z-10 bg-black/50 sm:hidden"
              />
            )}
            <ListboxButton className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface-elevated px-3 text-sm text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <span
                className={cn(
                  'truncate',
                  selectedLabels.length === 0 && 'text-muted-foreground',
                )}
              >
                {selectedLabels.length > 0
                  ? selectedLabels.join(', ')
                  : placeholder}
              </span>
              <ChevronDown
                aria-hidden="true"
                size={16}
                className="shrink-0 text-muted-foreground"
              />
            </ListboxButton>
            {/* No portal on purpose: portaled content would render behind the
              top-layer <dialog> used by Drawer/Modal */}
            <ListboxOptions className="z-20 overflow-auto rounded-md border border-border bg-surface-elevated p-1 focus:outline-none max-sm:fixed max-sm:inset-x-4 max-sm:top-1/2 max-sm:max-h-[60dvh] max-sm:-translate-y-1/2 max-sm:shadow-xl sm:absolute sm:mt-1 sm:max-h-56 sm:w-full sm:shadow-lg">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground data-focus:bg-surface-muted max-sm:py-2.5"
                >
                  {({ selected }) => (
                    <>
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        {selected && (
                          <Check
                            size={14}
                            aria-hidden="true"
                            className="text-primary"
                          />
                        )}
                      </span>
                      {option.label}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </div>
      )}
    </Listbox>
  )
}

import { CalendarDays } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { enUS, es, ptBR } from 'react-day-picker/locale'
import { useTranslation } from 'react-i18next'
import {
  cn,
  formatShortDate,
  maskShortDate,
  parseDateKey,
  parseShortDate,
  toDateKey,
} from '../../../utils'

const locales = {
  'pt-BR': ptBR,
  en: enUS,
  es,
} as const

interface DatePickerProps {
  label: string
  value: string
  onChange: (dateKey: string) => void
  className?: string
}

export function DatePicker({
  label,
  value,
  onChange,
  className,
}: DatePickerProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string | null>(null)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const inputId = useId()

  const selected = parseDateKey(value)
  const language = i18n.resolvedLanguage as keyof typeof locales | undefined
  const locale = locales[language ?? 'pt-BR'] ?? ptBR
  const displayValue = draft ?? formatShortDate(selected, i18n.language)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current
      if (container && !container.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return

    // fixed positioning is measured on open; close before it drifts
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    document.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('resize', close)
      document.removeEventListener('scroll', close, true)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open || !position) return

    // clamps the popup inside the viewport once its width is known
    const popup = popupRef.current
    if (!popup) return

    const width = popup.getBoundingClientRect().width
    const maxLeft = window.innerWidth - width - 8
    if (position.left > maxLeft) {
      setPosition({ top: position.top, left: Math.max(8, maxLeft) })
    }
  }, [open, position])

  const toggleOpen = () => {
    if (!open) {
      const rect = fieldRef.current?.getBoundingClientRect()
      const desktop = window.matchMedia('(min-width: 640px)').matches
      setPosition(
        desktop && rect ? { top: rect.bottom + 4, left: rect.left } : null,
      )
    }
    setOpen(!open)
  }

  const handleTyping = (text: string) => {
    const masked = maskShortDate(text, i18n.language)
    setDraft(masked)
    const parsed = parseShortDate(masked, i18n.language)
    if (parsed) onChange(toDateKey(parsed))
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
      className={cn('relative flex flex-col gap-1.5', className)}
    >
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div ref={fieldRef} className="flex items-center gap-1">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          placeholder={t('common.dateFormat')}
          value={displayValue}
          onChange={(event) => handleTyping(event.target.value)}
          onBlur={() => setDraft(null)}
          className="h-10 w-30 rounded-md border border-border bg-surface-elevated px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <button
          type="button"
          aria-label={t('common.openCalendar')}
          aria-expanded={open}
          onClick={toggleOpen}
          className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-elevated text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <CalendarDays size={16} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 bg-black/50 sm:hidden"
          />
          <div
            ref={popupRef}
            style={position ?? undefined}
            className={cn(
              'fixed z-20 w-fit rounded-md border border-border bg-surface-elevated p-2 shadow-lg',
              position === null &&
                'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            )}
          >
            <DayPicker
              mode="single"
              required
              selected={selected}
              defaultMonth={selected}
              locale={locale}
              onSelect={(date) => {
                setDraft(null)
                onChange(toDateKey(date))
                setOpen(false)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

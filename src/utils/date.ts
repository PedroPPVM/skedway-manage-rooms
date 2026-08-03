export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// new Date('yyyy-mm-dd') would parse as UTC midnight; this keeps local time
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)
}

export function formatShortDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function maskShortDate(text: string, locale: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8)
  const separator =
    new Intl.DateTimeFormat(locale)
      .formatToParts(new Date(2000, 10, 22))
      .find((part) => part.type === 'literal')?.value ?? '/'

  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join(separator)
}

// day/month/year order comes from Intl itself, so typing follows the
// same convention the field displays
export function parseShortDate(text: string, locale: string): Date | null {
  const numbers = text.trim().split(/\D+/).filter(Boolean)
  if (numbers.length !== 3) return null

  const order = new Intl.DateTimeFormat(locale)
    .formatToParts(new Date(2000, 10, 22))
    .map((part) => part.type)
    .filter(
      (type): type is 'day' | 'month' | 'year' =>
        type === 'day' || type === 'month' || type === 'year',
    )

  const values: Partial<Record<'day' | 'month' | 'year', number>> = {}
  order.forEach((type, index) => {
    values[type] = Number(numbers[index])
  })

  const { day, month, year } = values
  if (!day || !month || !year || String(year).length !== 4) return null

  const date = new Date(year, month - 1, day)
  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day

  return valid ? date : null
}

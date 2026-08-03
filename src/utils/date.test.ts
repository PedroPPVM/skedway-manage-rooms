import { formatDate, formatTime, parseDateKey, toDateKey } from './date'

describe('toDateKey', () => {
  it('formats a date as yyyy-mm-dd', () => {
    expect(toDateKey(new Date(2026, 7, 3))).toBe('2026-08-03')
  })

  it('pads month and day with leading zeros', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('uses the local date regardless of the time', () => {
    expect(toDateKey(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31')
  })
})

describe('parseDateKey', () => {
  it('parses the key as a local date at midnight', () => {
    const date = parseDateKey('2026-08-03')

    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(7)
    expect(date.getDate()).toBe(3)
    expect(date.getHours()).toBe(0)
  })

  it('roundtrips with toDateKey', () => {
    expect(toDateKey(parseDateKey('2026-08-03'))).toBe('2026-08-03')
  })
})

describe('formatTime / formatDate', () => {
  const date = new Date(2026, 7, 3, 9, 0)

  it('formats time by locale', () => {
    expect(formatTime(date, 'pt-BR')).toBe('09:00')
    expect(formatTime(date, 'en')).toContain('AM')
  })

  it('formats dates by locale', () => {
    expect(formatDate(date, 'pt-BR')).toContain('agosto')
    expect(formatDate(date, 'en')).toContain('August')
  })
})

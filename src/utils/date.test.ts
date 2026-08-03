import {
  formatDate,
  formatShortDate,
  formatTime,
  maskShortDate,
  parseDateKey,
  parseShortDate,
  toDateKey,
} from './date'

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

  it('formats short dates padded and ordered by locale', () => {
    expect(formatShortDate(date, 'pt-BR')).toBe('03/08/2026')
    expect(formatShortDate(date, 'en')).toBe('08/03/2026')
  })
})

describe('maskShortDate / parseShortDate', () => {
  it('masks digits progressively', () => {
    expect(maskShortDate('1', 'pt-BR')).toBe('1')
    expect(maskShortDate('150', 'pt-BR')).toBe('15/0')
    expect(maskShortDate('15082026', 'pt-BR')).toBe('15/08/2026')
    expect(maskShortDate('150820269', 'pt-BR')).toBe('15/08/2026')
  })

  it('parses respecting the locale field order', () => {
    expect(parseShortDate('15/08/2026', 'pt-BR')).toEqual(new Date(2026, 7, 15))
    expect(parseShortDate('08/15/2026', 'en')).toEqual(new Date(2026, 7, 15))
  })

  it('rejects incomplete or impossible dates', () => {
    expect(parseShortDate('15/08/26', 'pt-BR')).toBeNull()
    expect(parseShortDate('32/01/2026', 'pt-BR')).toBeNull()
    expect(parseShortDate('', 'pt-BR')).toBeNull()
  })
})

import { toDateKey } from './date'

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

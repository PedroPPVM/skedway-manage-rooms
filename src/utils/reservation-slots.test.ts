import type { Reservation } from '../types'
import { buildDaySchedule } from './day-schedule'
import { getAvailableDurations, getFreeStartTimes } from './reservation-slots'

const day = new Date(2026, 7, 3)

function at(hours: number, minutes = 0): string {
  return new Date(2026, 7, 3, hours, minutes).toISOString()
}

function reservation(startHour: number, endHour: number): Reservation {
  return {
    id: `reservation-${startHour}`,
    roomId: '1',
    responsible: 'Ana Souza',
    createdByEmail: 'ana.souza@example.com',
    startAt: at(startHour),
    endAt: at(endHour),
  }
}

describe('getFreeStartTimes', () => {
  it('returns only the starts of free slots', () => {
    const schedule = buildDaySchedule(day, [reservation(10, 11)])
    const starts = getFreeStartTimes(schedule)

    expect(starts).toHaveLength(18)
    expect(starts).toContain(at(9, 30))
    expect(starts).toContain(at(11))
    expect(starts).not.toContain(at(10))
    expect(starts).not.toContain(at(10, 30))
  })
})

describe('getAvailableDurations', () => {
  it('offers every step up to 4 hours on an open day', () => {
    expect(getAvailableDurations(at(9), [])).toEqual([
      30, 60, 90, 120, 150, 180, 210, 240,
    ])
  })

  it('is limited by the end of business hours', () => {
    expect(getAvailableDurations(at(16, 30), [])).toEqual([30, 60, 90])
    expect(getAvailableDurations(at(17, 30), [])).toEqual([30])
  })

  it('is limited by the next reservation', () => {
    expect(getAvailableDurations(at(10), [reservation(11, 12)])).toEqual([
      30, 60,
    ])
  })

  it('ignores reservations before the start time', () => {
    expect(getAvailableDurations(at(14), [reservation(9, 10)])).toEqual([
      30, 60, 90, 120, 150, 180, 210, 240,
    ])
  })
})

import type { Reservation } from '../types'
import {
  getDurationInMinutes,
  hasTimeConflict,
  isWithinBusinessHours,
  validateReservation,
} from './reservation-rules'

function at(hours: number, minutes = 0): string {
  return new Date(2026, 7, 3, hours, minutes).toISOString()
}

function reservation(
  roomId: string,
  startHour: number,
  endHour: number,
): Reservation {
  return {
    id: `reservation-${roomId}-${startHour}`,
    roomId,
    responsible: 'Ana Souza',
    startAt: at(startHour),
    endAt: at(endHour),
  }
}

describe('getDurationInMinutes', () => {
  it('returns the duration between two timestamps', () => {
    expect(getDurationInMinutes(at(10), at(11))).toBe(60)
    expect(getDurationInMinutes(at(10), at(11, 30))).toBe(90)
  })

  it('returns a negative value when the end is before the start', () => {
    expect(getDurationInMinutes(at(11), at(10))).toBe(-60)
  })
})

describe('isWithinBusinessHours', () => {
  it('accepts a reservation exactly at the business hours boundaries', () => {
    expect(isWithinBusinessHours(at(8), at(18))).toBe(true)
  })

  it('accepts a reservation inside business hours', () => {
    expect(isWithinBusinessHours(at(9), at(17))).toBe(true)
  })

  it('rejects a reservation starting before 08:00', () => {
    expect(isWithinBusinessHours(at(7, 59), at(9))).toBe(false)
  })

  it('rejects a reservation ending after 18:00', () => {
    expect(isWithinBusinessHours(at(17), at(18, 1))).toBe(false)
  })
})

describe('hasTimeConflict', () => {
  const existing = [reservation('1', 10, 12)]

  it('detects a partial overlap', () => {
    expect(
      hasTimeConflict(
        { roomId: '1', startAt: at(11), endAt: at(13) },
        existing,
      ),
    ).toBe(true)
  })

  it('detects a candidate fully containing an existing reservation', () => {
    expect(
      hasTimeConflict({ roomId: '1', startAt: at(9), endAt: at(13) }, existing),
    ).toBe(true)
  })

  it('ignores reservations from other rooms', () => {
    expect(
      hasTimeConflict(
        { roomId: '2', startAt: at(10), endAt: at(12) },
        existing,
      ),
    ).toBe(false)
  })

  it('allows adjacent reservations', () => {
    expect(
      hasTimeConflict(
        { roomId: '1', startAt: at(12), endAt: at(13) },
        existing,
      ),
    ).toBe(false)
    expect(
      hasTimeConflict({ roomId: '1', startAt: at(9), endAt: at(10) }, existing),
    ).toBe(false)
  })
})

describe('validateReservation', () => {
  const existing = [reservation('1', 10, 12)]

  it('returns null for a valid reservation', () => {
    expect(
      validateReservation(
        { roomId: '1', startAt: at(14), endAt: at(15) },
        existing,
      ),
    ).toBeNull()
  })

  it('rejects a non-positive duration', () => {
    expect(
      validateReservation(
        { roomId: '1', startAt: at(14), endAt: at(14) },
        existing,
      ),
    ).toBe('INVALID_DURATION')
  })

  it('rejects a duration above 4 hours', () => {
    expect(
      validateReservation(
        { roomId: '1', startAt: at(13), endAt: at(17, 30) },
        existing,
      ),
    ).toBe('INVALID_DURATION')
  })

  it('rejects a reservation outside business hours', () => {
    expect(
      validateReservation(
        { roomId: '1', startAt: at(6), endAt: at(7) },
        existing,
      ),
    ).toBe('OUTSIDE_BUSINESS_HOURS')
  })

  it('rejects a conflicting reservation', () => {
    expect(
      validateReservation(
        { roomId: '1', startAt: at(11), endAt: at(12) },
        existing,
      ),
    ).toBe('TIME_CONFLICT')
  })

  it('reports duration violations before business hours violations', () => {
    expect(
      validateReservation(
        { roomId: '1', startAt: at(5), endAt: at(11) },
        existing,
      ),
    ).toBe('INVALID_DURATION')
  })
})

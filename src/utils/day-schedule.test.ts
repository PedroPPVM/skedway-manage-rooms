import type { Reservation } from '../types'
import { buildDaySchedule } from './day-schedule'

const day = new Date(2026, 7, 3)

function at(hours: number, minutes = 0): string {
  return new Date(2026, 7, 3, hours, minutes).toISOString()
}

function reservation(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): Reservation {
  return {
    id: 'reservation-1',
    roomId: '1',
    responsible: 'Ana Souza',
    createdByEmail: 'ana.souza@example.com',
    startAt: at(startHour, startMinute),
    endAt: at(endHour, endMinute),
  }
}

function statusAt(
  slots: ReturnType<typeof buildDaySchedule>,
  hours: number,
  minutes: number,
) {
  const slot = slots.find((candidate) => {
    const start = new Date(candidate.startAt)
    return start.getHours() === hours && start.getMinutes() === minutes
  })
  if (!slot) throw new Error(`slot ${hours}:${minutes} not found`)
  return slot
}

describe('buildDaySchedule', () => {
  it('builds 20 free slots between 08:00 and 18:00 when there are no reservations', () => {
    const slots = buildDaySchedule(day, [])

    expect(slots).toHaveLength(20)
    expect(slots.every((slot) => slot.status === 'free')).toBe(true)
    expect(new Date(slots[0].startAt).getHours()).toBe(8)

    const last = new Date(slots[19].startAt)
    expect(last.getHours()).toBe(17)
    expect(last.getMinutes()).toBe(30)
  })

  it('marks covered slots with an exclusive end (10:00-11:30)', () => {
    const booked = reservation(10, 0, 11, 30)
    const slots = buildDaySchedule(day, [booked])

    expect(statusAt(slots, 10, 0).status).toBe('reserved')
    expect(statusAt(slots, 10, 30).status).toBe('reserved')
    expect(statusAt(slots, 11, 0).status).toBe('reserved')
    expect(statusAt(slots, 9, 30).status).toBe('free')
    expect(statusAt(slots, 11, 30).status).toBe('free')
    expect(statusAt(slots, 10, 0).reservation).toEqual(booked)
    expect(statusAt(slots, 9, 30).reservation).toBeNull()
  })

  it('marks partially overlapped slots (09:15-09:45)', () => {
    const slots = buildDaySchedule(day, [reservation(9, 15, 9, 45)])

    expect(statusAt(slots, 9, 0).status).toBe('reserved')
    expect(statusAt(slots, 9, 30).status).toBe('reserved')
    expect(statusAt(slots, 10, 0).status).toBe('free')
  })

  it('marks the last slot of the day (17:30-18:00)', () => {
    const slots = buildDaySchedule(day, [reservation(17, 30, 18, 0)])

    expect(statusAt(slots, 17, 30).status).toBe('reserved')
    expect(statusAt(slots, 17, 0).status).toBe('free')
  })
})

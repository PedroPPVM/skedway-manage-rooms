import type { Reservation, ScheduleSlot } from '../types'
import { BUSINESS_HOURS, DURATION_STEP_MINUTES } from './reservation-rules'

export function buildDaySchedule(
  date: Date,
  reservations: Reservation[],
): ScheduleSlot[] {
  const dayStart = new Date(date)
  dayStart.setHours(BUSINESS_HOURS.start, 0, 0, 0)

  const totalMinutes = (BUSINESS_HOURS.end - BUSINESS_HOURS.start) * 60
  const slots: ScheduleSlot[] = []

  for (let offset = 0; offset < totalMinutes; offset += DURATION_STEP_MINUTES) {
    const start = new Date(dayStart.getTime() + offset * 60_000)
    const end = new Date(start.getTime() + DURATION_STEP_MINUTES * 60_000)

    const reservation =
      reservations.find(
        (candidate) =>
          new Date(candidate.startAt).getTime() < end.getTime() &&
          start.getTime() < new Date(candidate.endAt).getTime(),
      ) ?? null

    slots.push({
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      status: reservation ? 'reserved' : 'free',
      reservation,
    })
  }

  return slots
}

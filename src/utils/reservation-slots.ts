import type { Reservation, ScheduleSlot } from '../types'
import {
  BUSINESS_HOURS,
  DURATION_STEP_MINUTES,
  MAX_RESERVATION_MINUTES,
} from './reservation-rules'

export function getFreeStartTimes(schedule: ScheduleSlot[]): string[] {
  return schedule
    .filter((slot) => slot.status === 'free')
    .map((slot) => slot.startAt)
}

export function getAvailableDurations(
  startAt: string,
  reservations: Reservation[],
): number[] {
  const start = new Date(startAt)
  const dayEnd = new Date(start)
  dayEnd.setHours(BUSINESS_HOURS.end, 0, 0, 0)

  const nextReservationStart = reservations
    .map((reservation) => new Date(reservation.startAt).getTime())
    .filter((time) => time > start.getTime())
    .sort((first, second) => first - second)[0]

  const limit = Math.min(
    start.getTime() + MAX_RESERVATION_MINUTES * 60_000,
    dayEnd.getTime(),
    nextReservationStart ?? Infinity,
  )

  const durations: number[] = []
  for (
    let minutes = DURATION_STEP_MINUTES;
    start.getTime() + minutes * 60_000 <= limit;
    minutes += DURATION_STEP_MINUTES
  ) {
    durations.push(minutes)
  }

  return durations
}

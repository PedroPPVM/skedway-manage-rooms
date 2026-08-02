import type { Reservation } from '../types'

export const BUSINESS_HOURS = { start: 8, end: 18 } as const
export const MAX_RESERVATION_MINUTES = 240
export const DURATION_STEP_MINUTES = 30

export type ReservationRuleError =
  'INVALID_DURATION' | 'OUTSIDE_BUSINESS_HOURS' | 'TIME_CONFLICT'

type ReservationPeriod = Pick<Reservation, 'roomId' | 'startAt' | 'endAt'>

export function getDurationInMinutes(startAt: string, endAt: string): number {
  return (new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000
}

export function isWithinBusinessHours(startAt: string, endAt: string): boolean {
  const start = new Date(startAt)
  const end = new Date(endAt)
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()

  return (
    startMinutes >= BUSINESS_HOURS.start * 60 &&
    endMinutes <= BUSINESS_HOURS.end * 60
  )
}

export function hasTimeConflict(
  candidate: ReservationPeriod,
  reservations: Reservation[],
): boolean {
  const start = new Date(candidate.startAt).getTime()
  const end = new Date(candidate.endAt).getTime()

  return reservations.some((reservation) => {
    if (reservation.roomId !== candidate.roomId) return false

    const reservationStart = new Date(reservation.startAt).getTime()
    const reservationEnd = new Date(reservation.endAt).getTime()

    return start < reservationEnd && reservationStart < end
  })
}

export function isRoomOccupiedAt(
  roomId: string,
  reservations: Reservation[],
  at: Date,
): boolean {
  const time = at.getTime()

  return reservations.some((reservation) => {
    if (reservation.roomId !== roomId) return false

    return (
      new Date(reservation.startAt).getTime() <= time &&
      time < new Date(reservation.endAt).getTime()
    )
  })
}

export function isReservationOwner(
  reservation: Pick<Reservation, 'createdByEmail'>,
  email: string,
): boolean {
  const owner = reservation.createdByEmail
  if (!owner || !email) return false
  return owner.toLowerCase() === email.toLowerCase()
}

export function validateReservation(
  candidate: ReservationPeriod,
  reservations: Reservation[],
): ReservationRuleError | null {
  const duration = getDurationInMinutes(candidate.startAt, candidate.endAt)

  if (duration <= 0 || duration > MAX_RESERVATION_MINUTES) {
    return 'INVALID_DURATION'
  }
  if (!isWithinBusinessHours(candidate.startAt, candidate.endAt)) {
    return 'OUTSIDE_BUSINESS_HOURS'
  }
  if (hasTimeConflict(candidate, reservations)) {
    return 'TIME_CONFLICT'
  }
  return null
}

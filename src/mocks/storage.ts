import type { Reservation } from '../types'
import { buildSeedReservations } from './data/reservations'

const STORAGE_KEY = 'skedway:reservations'

function getStoredReservations(): Reservation[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as Reservation[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export function getReservations(): Reservation[] {
  return [...buildSeedReservations(), ...getStoredReservations()]
}

export function saveReservation(reservation: Reservation): void {
  const stored = getStoredReservations()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, reservation]))
}

export function removeStoredReservation(id: string): void {
  const stored = getStoredReservations()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stored.filter((reservation) => reservation.id !== id)),
  )
}

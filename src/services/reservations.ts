import type { CreateReservationInput, Reservation } from '../types'
import { apiDelete, apiGet, apiPost } from './http'

export interface ReservationFilters {
  roomId?: string
  date?: string
}

export function getReservations(
  filters: ReservationFilters = {},
): Promise<Reservation[]> {
  const params = new URLSearchParams()
  if (filters.roomId) params.set('roomId', filters.roomId)
  if (filters.date) params.set('date', filters.date)

  const query = params.toString()
  return apiGet<Reservation[]>(`/api/reservations${query ? `?${query}` : ''}`)
}

export function createReservation(
  input: CreateReservationInput,
): Promise<Reservation> {
  return apiPost<Reservation>('/api/reservations', input)
}

// X-User-Email simulates the authenticated user a real backend would
// read from the session token
export function deleteReservation(
  id: string,
  userEmail: string,
): Promise<void> {
  return apiDelete(`/api/reservations/${id}`, { 'X-User-Email': userEmail })
}

import type { CreateReservationInput, Reservation } from '../types'
import { apiGet, apiPost } from './http'

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

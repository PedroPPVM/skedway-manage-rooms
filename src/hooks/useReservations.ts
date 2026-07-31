import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { getReservations, type ReservationFilters } from '../services'

export function useReservations(filters: ReservationFilters = {}) {
  return useQuery({
    queryKey: queryKeys.reservations.list(filters),
    queryFn: () => getReservations(filters),
  })
}

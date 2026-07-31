import type { ReservationFilters } from '../services'

export const queryKeys = {
  rooms: {
    all: ['rooms'] as const,
    detail: (id: string) => ['rooms', id] as const,
  },
  reservations: {
    all: ['reservations'] as const,
    list: (filters: ReservationFilters) => ['reservations', filters] as const,
  },
}

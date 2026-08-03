import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteReservation } from '../services'
import { queryKeys } from './query-keys'

interface CancelReservationInput {
  id: string
  userEmail: string
}

export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userEmail }: CancelReservationInput) =>
      deleteReservation(id, userEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all })
    },
  })
}

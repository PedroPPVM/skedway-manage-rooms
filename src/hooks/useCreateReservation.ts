import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { createReservation } from '../services'

export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all })
    },
  })
}

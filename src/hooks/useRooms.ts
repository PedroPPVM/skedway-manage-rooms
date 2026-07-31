import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { getRooms } from '../services'

export function useRooms() {
  return useQuery({
    queryKey: queryKeys.rooms.all,
    queryFn: getRooms,
  })
}

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { getRoomById } from '../services'

export function useRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(id),
    queryFn: () => getRoomById(id),
    enabled: id.length > 0,
  })
}

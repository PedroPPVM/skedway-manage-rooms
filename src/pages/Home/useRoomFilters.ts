import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseRoomFilters, serializeRoomFilters } from '../../utils'
import type { RoomFilters } from '../../utils'

export function useRoomFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseRoomFilters(searchParams), [searchParams])

  const setFilters = useCallback(
    (update: Partial<RoomFilters>) => {
      setSearchParams(
        (previous) =>
          serializeRoomFilters({ ...parseRoomFilters(previous), ...update }),
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return { filters, setFilters, clearFilters }
}

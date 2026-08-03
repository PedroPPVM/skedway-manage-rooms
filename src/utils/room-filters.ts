import { ROOM_RESOURCES } from '../types'
import type { Room, RoomResource } from '../types'

export interface RoomFilters {
  query: string
  minCapacity: number | null
  resources: RoomResource[]
  onlyAvailable: boolean
}

export const EMPTY_ROOM_FILTERS: RoomFilters = {
  query: '',
  minCapacity: null,
  resources: [],
  onlyAvailable: false,
}

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  const query = normalizeText(filters.query)

  return rooms.filter((room) => {
    if (query && !normalizeText(room.name).includes(query)) return false
    if (filters.minCapacity !== null && room.capacity < filters.minCapacity) {
      return false
    }
    if (
      !filters.resources.every((resource) => room.resources.includes(resource))
    ) {
      return false
    }
    if (filters.onlyAvailable && room.status !== 'available') return false
    return true
  })
}

export function countActiveRoomFilters(filters: RoomFilters): number {
  return (
    (filters.minCapacity !== null ? 1 : 0) +
    filters.resources.length +
    (filters.onlyAvailable ? 1 : 0)
  )
}

export function parseRoomFilters(params: URLSearchParams): RoomFilters {
  const capacity = Number(params.get('capacity'))
  const resources = (params.get('resources') ?? '')
    .split(',')
    .filter((value): value is RoomResource =>
      (ROOM_RESOURCES as readonly string[]).includes(value),
    )

  return {
    query: params.get('q') ?? '',
    minCapacity: Number.isInteger(capacity) && capacity > 0 ? capacity : null,
    resources,
    onlyAvailable: params.get('available') === '1',
  }
}

export function serializeRoomFilters(filters: RoomFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.query.trim()) params.set('q', filters.query)
  if (filters.minCapacity !== null) {
    params.set('capacity', String(filters.minCapacity))
  }
  if (filters.resources.length > 0) {
    params.set('resources', filters.resources.join(','))
  }
  if (filters.onlyAvailable) params.set('available', '1')

  return params
}

import type { Room } from '../types'
import {
  countActiveRoomFilters,
  EMPTY_ROOM_FILTERS,
  filterRooms,
  normalizeText,
  parseRoomFilters,
  serializeRoomFilters,
} from './room-filters'

const rooms: Room[] = [
  {
    id: '1',
    name: 'Sala Pégaso',
    capacity: 16,
    location: '4º Andar',
    resources: ['tv', 'video_conference'],
    status: 'available',
  },
  {
    id: '2',
    name: 'Sala Vega',
    capacity: 6,
    location: '2º Andar',
    resources: ['whiteboard'],
    status: 'occupied',
  },
  {
    id: '3',
    name: 'Auditório Centauri',
    capacity: 30,
    location: '5º Andar',
    resources: ['tv', 'video_conference', 'projector'],
    status: 'available',
  },
]

describe('normalizeText', () => {
  it('removes accents, casing and surrounding spaces', () => {
    expect(normalizeText('  Pégaso ')).toBe('pegaso')
    expect(normalizeText('AUDITÓRIO')).toBe('auditorio')
  })
})

describe('filterRooms', () => {
  it('returns everything with empty filters', () => {
    expect(filterRooms(rooms, EMPTY_ROOM_FILTERS)).toHaveLength(3)
  })

  it('matches names ignoring accents', () => {
    const result = filterRooms(rooms, {
      ...EMPTY_ROOM_FILTERS,
      query: 'pegaso',
    })
    expect(result.map((room) => room.name)).toEqual(['Sala Pégaso'])
  })

  it('filters by minimum capacity', () => {
    const result = filterRooms(rooms, {
      ...EMPTY_ROOM_FILTERS,
      minCapacity: 16,
    })
    expect(result).toHaveLength(2)
  })

  it('requires every selected resource', () => {
    const result = filterRooms(rooms, {
      ...EMPTY_ROOM_FILTERS,
      resources: ['tv', 'projector'],
    })
    expect(result.map((room) => room.name)).toEqual(['Auditório Centauri'])
  })

  it('filters by availability', () => {
    const result = filterRooms(rooms, {
      ...EMPTY_ROOM_FILTERS,
      onlyAvailable: true,
    })
    expect(result).toHaveLength(2)
  })

  it('combines filters', () => {
    const result = filterRooms(rooms, {
      query: 'sala',
      minCapacity: 10,
      resources: ['tv'],
      onlyAvailable: true,
    })
    expect(result.map((room) => room.name)).toEqual(['Sala Pégaso'])
  })
})

describe('countActiveRoomFilters', () => {
  it('counts capacity, each resource and availability, ignoring the query', () => {
    expect(countActiveRoomFilters(EMPTY_ROOM_FILTERS)).toBe(0)
    expect(
      countActiveRoomFilters({
        query: 'orion',
        minCapacity: 4,
        resources: ['tv', 'whiteboard'],
        onlyAvailable: true,
      }),
    ).toBe(4)
  })
})

describe('parseRoomFilters / serializeRoomFilters', () => {
  it('roundtrips filters through the url', () => {
    const filters = {
      query: 'orion',
      minCapacity: 8,
      resources: ['tv', 'whiteboard'] as const,
      onlyAvailable: true,
    }
    const params = serializeRoomFilters({
      ...filters,
      resources: [...filters.resources],
    })

    expect(params.toString()).toBe(
      'q=orion&capacity=8&resources=tv%2Cwhiteboard&available=1',
    )
    expect(parseRoomFilters(params)).toEqual(filters)
  })

  it('ignores invalid values in the url', () => {
    const params = new URLSearchParams(
      'capacity=abc&resources=tv,jacuzzi&available=yes',
    )

    expect(parseRoomFilters(params)).toEqual({
      query: '',
      minCapacity: null,
      resources: ['tv'],
      onlyAvailable: false,
    })
  })

  it('serializes empty filters to an empty query string', () => {
    expect(serializeRoomFilters(EMPTY_ROOM_FILTERS).toString()).toBe('')
  })
})

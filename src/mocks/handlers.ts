import { http, HttpResponse } from 'msw'
import type { Room } from '../types'

const rooms: Room[] = [
  {
    id: '1',
    name: 'Sala Orion',
    capacity: 12,
    location: '3º Andar',
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
]

export const handlers = [
  http.get('/api/rooms', () => {
    return HttpResponse.json(rooms)
  }),
]

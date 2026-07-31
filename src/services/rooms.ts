import type { Room } from '../types'
import { apiGet } from './http'

export function getRooms(): Promise<Room[]> {
  return apiGet<Room[]>('/api/rooms')
}

export function getRoomById(id: string): Promise<Room> {
  return apiGet<Room>(`/api/rooms/${id}`)
}

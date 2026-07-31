export const ROOM_RESOURCES = [
  'tv',
  'video_conference',
  'whiteboard',
  'projector',
  'air_conditioning',
] as const

export type RoomResource = (typeof ROOM_RESOURCES)[number]

export const ROOM_STATUSES = ['available', 'occupied'] as const

export type RoomStatus = (typeof ROOM_STATUSES)[number]

export interface Room {
  id: string
  name: string
  capacity: number
  location: string
  resources: RoomResource[]
  status: RoomStatus
}

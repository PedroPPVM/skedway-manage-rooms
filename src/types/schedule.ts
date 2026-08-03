import type { Reservation } from './reservation'

export const SLOT_STATUSES = ['free', 'reserved'] as const

export type SlotStatus = (typeof SLOT_STATUSES)[number]

export interface ScheduleSlot {
  startAt: string
  endAt: string
  status: SlotStatus
  reservation: Reservation | null
}

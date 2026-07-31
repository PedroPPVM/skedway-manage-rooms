export const SLOT_STATUSES = ['free', 'reserved'] as const

export type SlotStatus = (typeof SLOT_STATUSES)[number]

export interface ScheduleSlot {
  time: string
  status: SlotStatus
}

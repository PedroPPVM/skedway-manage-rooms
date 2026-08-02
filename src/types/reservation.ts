export interface Reservation {
  id: string
  roomId: string
  responsible: string
  createdByEmail: string
  startAt: string
  endAt: string
}

export type CreateReservationInput = Omit<Reservation, 'id'>

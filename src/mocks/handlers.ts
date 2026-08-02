import { delay, http, HttpResponse } from 'msw'
import type { CreateReservationInput, Reservation, Room } from '../types'
import {
  isReservationOwner,
  isRoomOccupiedAt,
  toDateKey,
  validateReservation,
} from '../utils'
import { rooms } from './data/rooms'
import {
  getReservations,
  removeStoredReservation,
  saveReservation,
} from './storage'

const RULE_ERROR_RESPONSES = {
  INVALID_DURATION: {
    status: 422,
    message: 'A duração deve ser entre 30 minutos e 4 horas.',
  },
  OUTSIDE_BUSINESS_HOURS: {
    status: 422,
    message:
      'As reservas devem estar dentro do horário comercial (08:00 às 18:00).',
  },
  TIME_CONFLICT: {
    status: 409,
    message: 'Esta sala já possui uma reserva neste horário.',
  },
} as const

function withStatus(room: Omit<Room, 'status'>): Room {
  const occupied = isRoomOccupiedAt(room.id, getReservations(), new Date())
  return { ...room, status: occupied ? 'occupied' : 'available' }
}

export const handlers = [
  http.get('/api/rooms', async () => {
    await delay(500)
    return HttpResponse.json(rooms.map(withStatus))
  }),

  http.get('/api/rooms/:id', async ({ params }) => {
    await delay(400)
    const room = rooms.find((room) => room.id === params.id)

    if (!room) {
      return HttpResponse.json(
        { code: 'ROOM_NOT_FOUND', message: 'Sala não encontrada.' },
        { status: 404 },
      )
    }
    return HttpResponse.json(withStatus(room))
  }),

  http.get('/api/reservations', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const roomId = url.searchParams.get('roomId')
    const date = url.searchParams.get('date')

    let reservations = getReservations()

    if (roomId) {
      reservations = reservations.filter(
        (reservation) => reservation.roomId === roomId,
      )
    }
    if (date) {
      reservations = reservations.filter(
        (reservation) => toDateKey(new Date(reservation.startAt)) === date,
      )
    }
    return HttpResponse.json(reservations)
  }),

  http.post('/api/reservations', async ({ request }) => {
    await delay(600)
    const input = (await request.json()) as CreateReservationInput

    if (
      !input.roomId ||
      !input.responsible?.trim() ||
      !input.createdByEmail?.trim() ||
      !input.startAt ||
      !input.endAt
    ) {
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Preencha todos os campos.' },
        { status: 400 },
      )
    }

    if (!rooms.some((room) => room.id === input.roomId)) {
      return HttpResponse.json(
        { code: 'ROOM_NOT_FOUND', message: 'Sala não encontrada.' },
        { status: 404 },
      )
    }

    const ruleError = validateReservation(input, getReservations())

    if (ruleError) {
      const { status, message } = RULE_ERROR_RESPONSES[ruleError]
      return HttpResponse.json({ code: ruleError, message }, { status })
    }

    const reservation: Reservation = { id: crypto.randomUUID(), ...input }
    saveReservation(reservation)

    return HttpResponse.json(reservation, { status: 201 })
  }),

  http.delete('/api/reservations/:id', async ({ params, request }) => {
    await delay(400)
    const reservation = getReservations().find(
      (candidate) => candidate.id === params.id,
    )

    if (!reservation) {
      return HttpResponse.json(
        { code: 'RESERVATION_NOT_FOUND', message: 'Reserva não encontrada.' },
        { status: 404 },
      )
    }

    const userEmail = request.headers.get('x-user-email') ?? ''

    if (!isReservationOwner(reservation, userEmail)) {
      return HttpResponse.json(
        {
          code: 'NOT_RESERVATION_OWNER',
          message: 'Apenas quem criou a reserva pode cancelá-la.',
        },
        { status: 403 },
      )
    }

    removeStoredReservation(reservation.id)
    return new HttpResponse(null, { status: 204 })
  }),
]

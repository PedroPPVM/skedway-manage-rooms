import type { Reservation } from '../../types'

function todayAt(hours: number, minutes = 0): string {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

export function buildSeedReservations(): Reservation[] {
  return [
    {
      id: 'seed-1',
      roomId: '1',
      responsible: 'Ana Souza',
      startAt: todayAt(10),
      endAt: todayAt(11),
    },
    {
      id: 'seed-2',
      roomId: '1',
      responsible: 'Carlos Lima',
      startAt: todayAt(14),
      endAt: todayAt(15, 30),
    },
    {
      id: 'seed-3',
      roomId: '2',
      responsible: 'Marina Alves',
      startAt: todayAt(9),
      endAt: todayAt(12),
    },
    {
      id: 'seed-4',
      roomId: '4',
      responsible: 'Rafael Costa',
      startAt: todayAt(11),
      endAt: todayAt(12, 30),
    },
    {
      id: 'seed-5',
      roomId: '5',
      responsible: 'Juliana Reis',
      startAt: todayAt(15),
      endAt: todayAt(17),
    },
    {
      id: 'seed-6',
      roomId: '6',
      responsible: 'Pedro Martins',
      startAt: todayAt(8),
      endAt: todayAt(10),
    },
    {
      id: 'seed-7',
      roomId: '10',
      responsible: 'Equipe de Vendas',
      startAt: todayAt(13),
      endAt: todayAt(16),
    },
  ]
}

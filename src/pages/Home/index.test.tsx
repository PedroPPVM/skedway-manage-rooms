import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '../../test/render'
import { server } from '../../test/server'
import Home from '.'

// Only Date is faked (10:30 today): Sala Orion has a 10:00-11:00 seed
// reservation, so derived statuses stay deterministic while MSW delays
// and waitFor keep using real timers
function fakeClockAt(hours: number, minutes: number) {
  const now = new Date()
  now.setHours(hours, minutes, 0, 0)
  vi.useFakeTimers({ toFake: ['Date'], now })
}

describe('Home (rooms listing)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows skeletons while loading', () => {
    renderWithProviders(<Home />)

    const loading = screen.getByText('Carregando salas...')
    expect(loading.closest('[role="status"]')).toBeInTheDocument()
  })

  it('lists the rooms with the five challenge fields', async () => {
    fakeClockAt(10, 30)
    renderWithProviders(<Home />)

    const orionTitle = await screen.findByText('Sala Orion', undefined, {
      timeout: 3000,
    })
    const orion = orionTitle.closest('li')!
    expect(within(orion).getByText('12 pessoas')).toBeInTheDocument()
    expect(within(orion).getByText('3º Andar')).toBeInTheDocument()
    expect(within(orion).getByText('TV')).toBeInTheDocument()
    expect(within(orion).getByText('Videoconferência')).toBeInTheDocument()
    expect(within(orion).getByText('Ocupada')).toBeInTheDocument()

    const draco = screen.getByText('Sala Draco').closest('li')!
    expect(within(draco).getByText('Disponível')).toBeInTheDocument()

    expect(screen.getByText('10 salas')).toBeInTheDocument()
  })

  it('shows the empty state when there are no rooms', async () => {
    server.use(http.get('/api/rooms', () => HttpResponse.json([])))
    renderWithProviders(<Home />)

    expect(
      await screen.findByText('Nenhuma sala encontrada'),
    ).toBeInTheDocument()
  })

  it('shows the error state and recovers on retry', async () => {
    server.use(
      http.get('/api/rooms', () => HttpResponse.error(), { once: true }),
    )
    const user = userEvent.setup()
    renderWithProviders(<Home />)

    expect(
      await screen.findByText('Erro ao carregar as salas'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(
      await screen.findByText('Sala Orion', undefined, { timeout: 3000 }),
    ).toBeInTheDocument()
  })
})

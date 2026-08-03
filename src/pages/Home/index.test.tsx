import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { useSearchParams } from 'react-router-dom'
import { renderWithProviders } from '../../test/render'
import { server } from '../../test/server'
import Home from '.'

function LocationProbe() {
  const [searchParams] = useSearchParams()
  return <div data-testid="query-string">{searchParams.toString()}</div>
}

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

  it('searches by name ignoring accents and syncs the url', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <Home />
        <LocationProbe />
      </>,
    )
    await screen.findByText('Sala Orion', undefined, { timeout: 3000 })

    await user.type(screen.getByLabelText('Pesquisar sala'), 'pegaso')

    expect(await screen.findByText('1 de 10 salas')).toBeInTheDocument()
    expect(screen.getByText('Sala Pégaso')).toBeInTheDocument()
    expect(screen.queryByText('Sala Orion')).not.toBeInTheDocument()
    expect(screen.getByTestId('query-string')).toHaveTextContent('q=pegaso')
  })

  it('filters by people count typed in the capacity input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Home />)
    await screen.findByText('Sala Orion', undefined, { timeout: 3000 })

    await user.type(screen.getByLabelText('Capacidade mínima'), '16')

    expect(await screen.findByText('3 de 10 salas')).toBeInTheDocument()
    expect(screen.queryByText('Sala Vega')).not.toBeInTheDocument()
  })

  it('clears the search from the persistent clear button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Home />)
    await screen.findByText('Sala Orion', undefined, { timeout: 3000 })

    await user.type(screen.getByLabelText('Pesquisar sala'), 'pegaso')
    expect(await screen.findByText('1 de 10 salas')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Limpar pesquisa' }))

    expect(await screen.findByText('10 salas')).toBeInTheDocument()
    expect(screen.getByLabelText('Pesquisar sala')).toHaveValue('')
    expect(
      screen.queryByRole('button', { name: 'Limpar pesquisa' }),
    ).not.toBeInTheDocument()
  })

  it('applies filters from the url on first render', async () => {
    renderWithProviders(<Home />, {
      initialEntries: ['/?capacity=16&resources=tv'],
    })

    expect(await screen.findByText('3 de 10 salas')).toBeInTheDocument()
    expect(screen.getByText('Sala Pégaso')).toBeInTheDocument()
    expect(screen.getByText('Auditório Centauri')).toBeInTheDocument()
    expect(screen.queryByText('Sala Vega')).not.toBeInTheDocument()
  })

  it('shows the filtered empty state and clears filters from it', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Home />, { initialEntries: ['/?q=inexistente'] })

    const emptyTitle = await screen.findByText(
      'Nenhuma sala corresponde aos filtros',
    )
    const emptyState = emptyTitle.closest('div')!

    await user.click(
      within(emptyState).getByRole('button', { name: 'Limpar filtros' }),
    )

    expect(await screen.findByText('10 salas')).toBeInTheDocument()
    expect(screen.getByText('Sala Orion')).toBeInTheDocument()
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

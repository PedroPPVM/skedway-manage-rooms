import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { renderWithProviders } from '../../test/render'
import Home from '../Home'
import RoomDetails from '.'

function LocationProbe() {
  const [searchParams] = useSearchParams()
  return <div data-testid="query-string">{searchParams.toString()}</div>
}

function renderApp(initialEntries: string[]) {
  return renderWithProviders(
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="rooms/:id" element={<RoomDetails />} />
        </Route>
      </Routes>
      <LocationProbe />
    </>,
    { initialEntries },
  )
}

function fakeClockAt(hours: number, minutes: number) {
  const now = new Date()
  now.setHours(hours, minutes, 0, 0)
  vi.useFakeTimers({ toFake: ['Date'], now })
}

function todayAtIso(hours: number, minutes = 0): string {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

function openDialog(): HTMLDialogElement {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[open]')
  if (!dialog) throw new Error('no open dialog')
  return dialog
}

function scheduleRow(dialog: HTMLElement, time: string): HTMLElement {
  const row = within(dialog).getByText(time).closest('li')
  if (!row) throw new Error(`row ${time} not found`)
  return row
}

describe('RoomDetails', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      'skedway:user',
      JSON.stringify({ name: 'Pedro Paulo', email: 'pedro@empresa.com' }),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens from the card and closes preserving the query string', async () => {
    fakeClockAt(9, 0)
    const user = userEvent.setup()
    renderApp(['/?q=orion'])

    const link = await screen.findByRole(
      'link',
      { name: /Sala Orion/ },
      { timeout: 3000 },
    )
    await user.click(link)

    const dialog = openDialog()
    expect(await within(dialog).findByText('3º Andar')).toBeInTheDocument()
    expect(within(dialog).getByText('12 pessoas')).toBeInTheDocument()
    expect(screen.getByTestId('query-string')).toHaveTextContent('q=orion')

    await user.click(within(dialog).getByRole('button', { name: 'Fechar' }))

    await waitFor(() => {
      expect(document.querySelector('dialog[open]')).toBeNull()
    })
    expect(screen.getByTestId('query-string')).toHaveTextContent('q=orion')
  })

  it('shows the day schedule with reserved and free slots', async () => {
    fakeClockAt(9, 0)
    renderApp(['/rooms/1'])

    const dialog = openDialog()
    const reservedRow = await within(dialog).findByText('10:00', undefined, {
      timeout: 3000,
    })
    const row = reservedRow.closest('li')!

    expect(within(row).getByText('Reservado')).toBeInTheDocument()
    expect(within(row).getByText('Ana Souza')).toBeInTheDocument()
    expect(
      within(row).queryByRole('button', { name: 'Cancelar reserva' }),
    ).not.toBeInTheDocument()

    const freeRow = scheduleRow(dialog, '09:00')
    expect(within(freeRow).getByText('Livre')).toBeInTheDocument()
  })

  it('cancels an owned reservation after confirmation', async () => {
    fakeClockAt(9, 0)
    localStorage.setItem(
      'skedway:reservations',
      JSON.stringify([
        {
          id: 'mine-1',
          roomId: '1',
          responsible: 'Pedro Paulo',
          createdByEmail: 'pedro@empresa.com',
          startAt: todayAtIso(16),
          endAt: todayAtIso(17),
        },
      ]),
    )
    const user = userEvent.setup()
    renderApp(['/rooms/1'])

    const detailsDialog = openDialog()
    await within(detailsDialog).findByText('16:00', undefined, {
      timeout: 3000,
    })
    const ownRow = scheduleRow(detailsDialog, '16:00')

    await user.click(
      within(ownRow).getByRole('button', { name: 'Cancelar reserva' }),
    )

    const confirmation = screen
      .getByText('Cancelar reserva?')
      .closest('dialog')!
    await user.click(
      within(confirmation).getByRole('button', { name: 'Cancelar reserva' }),
    )

    expect(
      await screen.findByText('Reserva cancelada com sucesso.', undefined, {
        timeout: 3000,
      }),
    ).toBeInTheDocument()

    await waitFor(
      () => {
        const row = scheduleRow(detailsDialog, '16:00')
        expect(within(row).getByText('Livre')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})

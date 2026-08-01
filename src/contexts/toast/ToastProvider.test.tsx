import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function Demo() {
  const toast = useToast()

  return (
    <div>
      <button onClick={() => toast.success('Reserva criada')}>sucesso</button>
      <button onClick={() => toast.error('Horário ocupado')}>erro</button>
      <button onClick={() => toast.info(`Aviso ${crypto.randomUUID()}`)}>
        aviso
      </button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <ToastProvider>
      <Demo />
    </ToastProvider>,
  )
}

describe('ToastProvider', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a toast inside an aria-live region', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'sucesso' }))

    const region = screen.getByRole('status')
    expect(region).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('Reserva criada')).toBeInTheDocument()
  })

  it('dismisses a toast manually', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'erro' }))
    await user.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(screen.queryByText('Horário ocupado')).not.toBeInTheDocument()
  })

  it('dismisses a toast automatically after 5 seconds', () => {
    vi.useFakeTimers()
    renderWithProvider()

    fireEvent.click(screen.getByRole('button', { name: 'sucesso' }))
    expect(screen.getByText('Reserva criada')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.queryByText('Reserva criada')).not.toBeInTheDocument()
  })

  it('keeps at most 3 toasts on screen', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'sucesso' }))
    await user.click(screen.getByRole('button', { name: 'erro' }))
    await user.click(screen.getByRole('button', { name: 'aviso' }))
    await user.click(screen.getByRole('button', { name: 'aviso' }))

    expect(screen.queryByText('Reserva criada')).not.toBeInTheDocument()
    expect(screen.getByText('Horário ocupado')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: 'Fechar notificação' }),
    ).toHaveLength(3)
  })

  it('throws when useToast is used outside the provider', () => {
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within a ToastProvider',
    )
  })
})

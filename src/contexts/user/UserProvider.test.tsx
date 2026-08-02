import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserProvider } from './UserProvider'
import { useUser } from './useUser'

function Demo() {
  const { user, signIn, signOut } = useUser()

  return (
    <div>
      <span data-testid="user">{user ? user.email : 'anonymous'}</span>
      <button onClick={() => signIn({ name: 'Ana', email: 'ana@empresa.com' })}>
        entrar
      </button>
      <button onClick={signOut}>sair</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <UserProvider>
      <Demo />
    </UserProvider>,
  )
}

describe('UserProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts anonymous without stored user', () => {
    renderWithProvider()

    expect(screen.getByTestId('user')).toHaveTextContent('anonymous')
  })

  it('signs in and persists the user', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'entrar' }))

    expect(screen.getByTestId('user')).toHaveTextContent('ana@empresa.com')
    expect(JSON.parse(localStorage.getItem('skedway:user')!)).toEqual({
      name: 'Ana',
      email: 'ana@empresa.com',
    })
  })

  it('restores the stored user on mount', () => {
    localStorage.setItem(
      'skedway:user',
      JSON.stringify({ name: 'Ana', email: 'ana@empresa.com' }),
    )
    renderWithProvider()

    expect(screen.getByTestId('user')).toHaveTextContent('ana@empresa.com')
  })

  it('signs out clearing only the user key', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      'skedway:user',
      JSON.stringify({ name: 'Ana', email: 'ana@empresa.com' }),
    )
    localStorage.setItem('skedway:reservations', '[]')
    localStorage.setItem('skedway:theme', 'dark')
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'sair' }))

    expect(screen.getByTestId('user')).toHaveTextContent('anonymous')
    expect(localStorage.getItem('skedway:user')).toBeNull()
    expect(localStorage.getItem('skedway:reservations')).toBe('[]')
    expect(localStorage.getItem('skedway:theme')).toBe('dark')
  })

  it('ignores corrupted stored data', () => {
    localStorage.setItem('skedway:user', 'not-json')
    renderWithProvider()

    expect(screen.getByTestId('user')).toHaveTextContent('anonymous')
  })

  it('throws when useUser is used outside the provider', () => {
    expect(() => renderHook(() => useUser())).toThrow(
      'useUser must be used within a UserProvider',
    )
  })
})

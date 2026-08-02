import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '../../contexts/theme'
import { UserProvider } from '../../contexts/user'
import Login from '.'

function renderLogin() {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <Login /> },
      { path: '/', element: <div>página inicial</div> },
    ],
    { initialEntries: ['/login'] },
  )

  render(
    <ThemeProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows accessible validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    const name = screen.getByLabelText('Nome')
    const email = screen.getByLabelText('Email')
    expect(name).toHaveAccessibleDescription(
      'Informe seu nome (mínimo 2 caracteres).',
    )
    expect(email).toHaveAccessibleDescription('Informe um email válido.')
  })

  it('rejects an invalid email', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await user.type(screen.getByLabelText('Email'), 'email-invalido')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Informe um email válido.',
    )
  })

  it('signs in and navigates to the app on valid submit', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await user.type(screen.getByLabelText('Email'), 'ana@empresa.com')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('página inicial')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('skedway:user')!)).toEqual({
      name: 'Ana Souza',
      email: 'ana@empresa.com',
    })
  })

  it('redirects to the app when already signed in', () => {
    localStorage.setItem(
      'skedway:user',
      JSON.stringify({ name: 'Ana', email: 'ana@empresa.com' }),
    )
    renderLogin()

    expect(screen.getByText('página inicial')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '../contexts/theme'
import { UserProvider } from '../contexts/user'
import { ProtectedLayout } from './ProtectedLayout'

function renderProtected() {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <div>página de login</div> },
      {
        element: <ProtectedLayout />,
        children: [{ path: '/', element: <div>conteúdo protegido</div> }],
      },
    ],
    { initialEntries: ['/'] },
  )

  render(
    <ThemeProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>,
  )
}

describe('ProtectedLayout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects anonymous visitors to the login page', () => {
    renderProtected()

    expect(screen.getByText('página de login')).toBeInTheDocument()
    expect(screen.queryByText('conteúdo protegido')).not.toBeInTheDocument()
  })

  it('renders the protected content with the user in the header', () => {
    localStorage.setItem(
      'skedway:user',
      JSON.stringify({ name: 'Ana Souza', email: 'ana@empresa.com' }),
    )
    renderProtected()

    expect(screen.getByText('conteúdo protegido')).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })
})

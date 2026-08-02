import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../contexts/theme'
import { ToastProvider } from '../contexts/toast'
import { UserProvider } from '../contexts/user'

interface RenderWithProvidersOptions {
  initialEntries?: string[]
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'] }: RenderWithProvidersOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <QueryClientProvider client={queryClient}>
              <MemoryRouter initialEntries={initialEntries}>
                {children}
              </MemoryRouter>
            </QueryClientProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    )
  }

  return { ...render(ui, { wrapper: Wrapper }), queryClient }
}

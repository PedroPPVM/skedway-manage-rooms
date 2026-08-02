import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { ThemeProvider } from '../contexts/theme'
import { ToastProvider } from '../contexts/toast'
import { UserProvider } from '../contexts/user'

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    )
  }

  return { ...render(ui, { wrapper: Wrapper }), queryClient }
}

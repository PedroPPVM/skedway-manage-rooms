import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './contexts/theme'
import { ToastProvider } from './contexts/toast'
import { UserProvider } from './contexts/user'
import { queryClient } from './lib/query-client'
import { router } from './routes'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

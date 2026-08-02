import { Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '../components/layout'
import { useUser } from '../contexts/user'

export function ProtectedLayout() {
  const { user } = useUser()

  if (!user) return <Navigate to="/login" replace />

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

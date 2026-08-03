import { lazy } from 'react'
import { Spinner } from '../components/ui'

export const Login = lazy(() => import('../pages/Login'))
export const RoomDetails = lazy(() => import('../pages/RoomDetails'))

export function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface">
      <Spinner />
    </div>
  )
}

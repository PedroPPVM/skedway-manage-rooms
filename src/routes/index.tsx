import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import { Login, RoomDetails, RouteFallback } from './lazy-pages'
import { ProtectedLayout } from './ProtectedLayout'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          {
            path: 'rooms/:id',
            element: (
              <Suspense fallback={null}>
                <RoomDetails />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
])

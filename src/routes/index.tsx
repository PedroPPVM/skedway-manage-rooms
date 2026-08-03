import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import RoomDetails from '../pages/RoomDetails'
import { ProtectedLayout } from './ProtectedLayout'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
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
            element: <RoomDetails />,
          },
        ],
      },
    ],
  },
])

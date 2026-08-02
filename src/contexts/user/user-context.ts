import { createContext } from 'react'

export interface User {
  name: string
  email: string
}

export interface UserContextValue {
  user: User | null
  signIn: (user: User) => void
  signOut: () => void
}

export const UserContext = createContext<UserContextValue | null>(null)

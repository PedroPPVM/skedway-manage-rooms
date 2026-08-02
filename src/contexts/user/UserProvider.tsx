import { useCallback, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { UserContext } from './user-context'
import type { User, UserContextValue } from './user-context'

const STORAGE_KEY = 'skedway:user'

function getStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as User
    return parsed?.name && parsed?.email ? parsed : null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(getStoredUser)

  const signIn = useCallback((next: User) => {
    setUser(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo<UserContextValue>(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

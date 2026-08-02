import { LogOut } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../../contexts/user'
import { Button, LanguageSwitcher, ThemeToggle } from '../ui'

export function AppLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  const { user, signOut } = useUser()

  return (
    <div className="flex h-dvh flex-col bg-surface">
      <header className="border-b border-border bg-surface-elevated">
        <div className="flex h-14 w-full items-center justify-between gap-3 px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Skedway
          </span>
          <div className="flex items-center gap-2">
            {user && (
              <span className="max-w-40 truncate text-sm text-muted-foreground max-sm:hidden">
                {user.name}
              </span>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
            {user && (
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut size={16} aria-hidden="true" />
                <span className="max-sm:sr-only">{t('user.signOut')}</span>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  )
}

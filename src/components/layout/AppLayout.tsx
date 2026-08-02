import type { PropsWithChildren } from 'react'
import { LanguageSwitcher, ThemeToggle } from '../ui'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-border bg-surface-elevated">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Skedway
          </span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  )
}

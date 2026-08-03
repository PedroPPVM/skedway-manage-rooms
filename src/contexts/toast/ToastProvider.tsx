import { useCallback, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { ToastViewport } from '../../components/ui/Toast/Toast'
import { ToastContext } from './toast-context'
import type { Toast, ToastContextValue, ToastVariant } from './toast-context'

const MAX_TOASTS = 3
const DISMISS_AFTER_MS = 5000

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (variant: ToastVariant, message: string) => {
      const toast: Toast = { id: crypto.randomUUID(), variant, message }
      setToasts((current) => [...current, toast].slice(-MAX_TOASTS))
      setTimeout(() => dismiss(toast.id), DISMISS_AFTER_MS)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
